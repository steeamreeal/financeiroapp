"use server";

import Anthropic from "@anthropic-ai/sdk";
import type { ParsedTransaction } from "@/lib/types";

interface ExtractedReceipt {
  transactions: ParsedTransaction[];
  warning?: string;
}

export async function extractTransactionsFromDocument(
  base64Data: string,
  mediaType: string,
  filename: string
): Promise<ExtractedReceipt> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "Reconhecimento por IA não configurado. Peça ao administrador para definir ANTHROPIC_API_KEY."
    );
  }

  const client = new Anthropic();
  const isPdf = mediaType === "application/pdf";

  const documentBlock = isPdf
    ? {
        type: "document" as const,
        source: {
          type: "base64" as const,
          media_type: "application/pdf" as const,
          data: base64Data,
        },
      }
    : {
        type: "image" as const,
        source: {
          type: "base64" as const,
          media_type: mediaType as
            | "image/jpeg"
            | "image/png"
            | "image/webp"
            | "image/gif",
          data: base64Data,
        },
      };

  const response = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            transactions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  description: { type: "string" },
                  amount: { type: "number" },
                  date: {
                    type: "string",
                    description: "Data no formato YYYY-MM-DD",
                  },
                  type: { type: "string", enum: ["receita", "despesa"] },
                  notes: { type: "string" },
                },
                required: ["description", "amount", "date", "type"],
                additionalProperties: false,
              },
            },
          },
          required: ["transactions"],
          additionalProperties: false,
        },
      },
    },
    messages: [
      {
        role: "user",
        content: [
          documentBlock,
          {
            type: "text",
            text: `Este é um comprovante de pagamento, nota fiscal ou extrato bancário (arquivo: ${filename}). Extraia todas as transações financeiras visíveis (valores que entraram = receita, valores que saíram = despesa). Para cada transação, retorne descrição curta e clara, valor (sempre positivo), data no formato YYYY-MM-DD (use o ano atual se não estiver explícito) e o tipo. Se houver informações extras relevantes (forma de pagamento, número do documento, parcelas), inclua em "notes". Se não conseguir identificar nenhuma transação, retorne uma lista vazia.`,
          },
        ],
      },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    return { transactions: [], warning: "Não foi possível ler o documento." };
  }

  try {
    const parsed = JSON.parse(textBlock.text) as ExtractedReceipt;
    if (!parsed.transactions || parsed.transactions.length === 0) {
      return {
        transactions: [],
        warning: "Nenhuma transação foi identificada neste documento.",
      };
    }
    return { transactions: parsed.transactions };
  } catch {
    return {
      transactions: [],
      warning: "Não foi possível interpretar o resultado da IA.",
    };
  }
}

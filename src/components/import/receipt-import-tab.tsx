"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ImageUp, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { extractTransactionsFromDocument } from "@/app/dashboard/ocr-actions";
import { importTransactions } from "@/app/dashboard/actions";
import { ImportPreviewTable } from "./import-preview-table";
import type { Category, ParsedTransaction } from "@/lib/types";

function fileToBase64(file: File): Promise<{ data: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [meta, data] = result.split(",");
      const mediaType = meta.match(/data:(.*);base64/)?.[1] ?? file.type;
      resolve({ data, mediaType });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function ReceiptImportTab({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [isReading, setIsReading] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  async function handleFile(file: File) {
    setFileName(file.name);
    setIsReading(true);
    setTransactions([]);
    try {
      const { data, mediaType } = await fileToBase64(file);
      const result = await extractTransactionsFromDocument(
        data,
        mediaType,
        file.name
      );
      if (result.warning) {
        toast.warning(result.warning);
      }
      if (result.transactions.length > 0) {
        setTransactions(result.transactions);
        toast.success(
          `${result.transactions.length} lançamento(s) reconhecidos. Confira os valores antes de salvar.`
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao processar o comprovante."
      );
    } finally {
      setIsReading(false);
    }
  }

  async function handleImport() {
    setIsImporting(true);
    try {
      const result = await importTransactions(
        transactions,
        categoryId || null,
        "ocr"
      );
      toast.success(`${result.count} transações importadas com sucesso.`);
      setTransactions([]);
      router.push("/dashboard/transacoes");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao importar transações."
      );
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border p-10 text-center transition-colors hover:border-primary/40"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
      >
        {isReading ? (
          <>
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Lendo {fileName}...
            </p>
          </>
        ) : (
          <>
            <ImageUp className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Envie uma foto ou PDF de nota fiscal, comprovante ou recibo
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Selecionar arquivo
            </Button>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {transactions.length > 0 && (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Categoria para todos os lançamentos:
              </span>
              <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Outros (padrão)" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleImport} disabled={isImporting}>
              {isImporting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Importar {transactions.length} lançamento(s)
            </Button>
          </div>

          <ImportPreviewTable
            transactions={transactions}
            onChange={setTransactions}
          />
        </>
      )}
    </div>
  );
}

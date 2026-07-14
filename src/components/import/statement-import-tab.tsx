"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseStatementFile } from "@/lib/import/parse-statement";
import { fileToBase64 } from "@/lib/import/file-to-base64";
import { importTransactions } from "@/app/dashboard/actions";
import { extractTransactionsFromDocument } from "@/app/dashboard/ocr-actions";
import { ImportPreviewTable } from "./import-preview-table";
import type {
  Category,
  ParsedTransaction,
  TransactionSource,
} from "@/lib/types";

export function StatementImportTab({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [source, setSource] = useState<TransactionSource>("csv");

  function handleTextFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const result = parseStatementFile(file.name, content);
      setTransactions(result.transactions);
      setWarnings(result.warnings);
      setSource(file.name.toLowerCase().endsWith(".ofx") ? "ofx" : "csv");
      if (result.transactions.length > 0) {
        toast.success(
          `${result.transactions.length} lançamento(s) encontrados. Revise antes de importar.`
        );
      }
    };
    reader.readAsText(file, "utf-8");
  }

  async function handlePdfFile(file: File) {
    setIsReading(true);
    setTransactions([]);
    setWarnings([]);
    try {
      const { data, mediaType } = await fileToBase64(file);
      const result = await extractTransactionsFromDocument(
        data,
        mediaType,
        file.name
      );
      setSource("ocr");
      if (result.warning) {
        setWarnings([result.warning]);
      }
      if (result.transactions.length > 0) {
        setTransactions(result.transactions);
        toast.success(
          `${result.transactions.length} lançamento(s) reconhecidos. Revise antes de importar.`
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao ler o PDF do extrato."
      );
    } finally {
      setIsReading(false);
    }
  }

  function handleFile(file: File) {
    if (file.name.toLowerCase().endsWith(".pdf")) {
      handlePdfFile(file);
    } else {
      handleTextFile(file);
    }
  }

  async function handleImport() {
    setIsImporting(true);
    try {
      const result = await importTransactions(
        transactions,
        categoryId || null,
        source
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
              Lendo o extrato em PDF...
            </p>
          </>
        ) : (
          <>
            <FileUp className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Arraste um arquivo .csv, .ofx ou .pdf do seu banco aqui, ou
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              Selecionar arquivo
            </Button>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.ofx,.pdf,text/csv,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {warnings.length > 0 && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200">
          {warnings.map((w) => (
            <p key={w}>{w}</p>
          ))}
        </div>
      )}

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

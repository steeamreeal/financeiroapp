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
import { importTransactions } from "@/app/dashboard/actions";
import { ImportPreviewTable } from "./import-preview-table";
import type { Category, ParsedTransaction } from "@/lib/types";

export function StatementImportTab({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([]);
  const [categoryId, setCategoryId] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const [warnings, setWarnings] = useState<string[]>([]);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const content = reader.result as string;
      const result = parseStatementFile(file.name, content);
      setTransactions(result.transactions);
      setWarnings(result.warnings);
      if (result.transactions.length > 0) {
        toast.success(
          `${result.transactions.length} lançamento(s) encontrados. Revise antes de importar.`
        );
      }
    };
    reader.readAsText(file, "utf-8");
  }

  async function handleImport() {
    setIsImporting(true);
    try {
      const result = await importTransactions(
        transactions,
        categoryId || null,
        "csv"
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
        <FileUp className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Arraste um arquivo .csv ou .ofx do seu banco aqui, ou
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          Selecionar arquivo
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept=".csv,.ofx,text/csv"
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

"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Transaction } from "@/lib/types";
import { formatDate } from "@/lib/format";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function ExportCsvButton({
  transactions,
}: {
  transactions: Transaction[];
}) {
  function handleExport() {
    const header = ["Data", "Descrição", "Categoria", "Tipo", "Valor"];
    const rows = transactions.map((t) => [
      formatDate(t.date),
      escapeCsv(t.description),
      escapeCsv(t.category?.name ?? "Outros"),
      t.type === "receita" ? "Receita" : "Despesa",
      t.amount.toFixed(2).replace(".", ","),
    ]);

    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob(["﻿" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transacoes-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={transactions.length === 0}
    >
      <Download className="mr-2 h-4 w-4" />
      Exportar CSV
    </Button>
  );
}

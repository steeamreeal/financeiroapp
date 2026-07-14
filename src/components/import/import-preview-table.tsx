"use client";

import { Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ParsedTransaction } from "@/lib/types";

interface ImportPreviewTableProps {
  transactions: ParsedTransaction[];
  onChange: (transactions: ParsedTransaction[]) => void;
}

export function ImportPreviewTable({
  transactions,
  onChange,
}: ImportPreviewTableProps) {
  function updateRow(index: number, patch: Partial<ParsedTransaction>) {
    const next = transactions.map((t, i) =>
      i === index ? { ...t, ...patch } : t
    );
    onChange(next);
  }

  function removeRow(index: number) {
    onChange(transactions.filter((_, i) => i !== index));
  }

  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Nenhum lançamento para revisar ainda.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="w-[50px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((t, index) => (
            <TableRow key={index}>
              <TableCell>
                <Input
                  type="date"
                  value={t.date}
                  onChange={(e) => updateRow(index, { date: e.target.value })}
                  className="w-[150px]"
                />
              </TableCell>
              <TableCell>
                <Input
                  value={t.description}
                  onChange={(e) =>
                    updateRow(index, { description: e.target.value })
                  }
                />
              </TableCell>
              <TableCell>
                <Select
                  value={t.type}
                  onValueChange={(v) =>
                    v && updateRow(index, { type: v as "receita" | "despesa" })
                  }
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="despesa">Despesa</SelectItem>
                    <SelectItem value="receita">Receita</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="text-right">
                <Input
                  type="number"
                  step="0.01"
                  value={t.amount}
                  onChange={(e) =>
                    updateRow(index, { amount: Number(e.target.value) })
                  }
                  className="w-[110px] text-right"
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(index)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

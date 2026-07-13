"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Category, Transaction } from "@/lib/types";
import { TransactionFormDialog } from "./transaction-form-dialog";
import { DeleteTransactionDialog } from "./delete-transaction-dialog";

export function TransactionsTable({
  transactions,
  categories,
}: {
  transactions: Transaction[];
  categories: Category[];
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<
    Transaction | undefined
  >();
  const [deletingTransaction, setDeletingTransaction] = useState<
    Transaction | undefined
  >();

  function openCreate() {
    setEditingTransaction(undefined);
    setFormOpen(true);
  }

  function openEdit(transaction: Transaction) {
    setEditingTransaction(transaction);
    setFormOpen(true);
  }

  return (
    <>
      <div className="flex justify-end">
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nova transação
        </Button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="w-[100px] text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  Nenhuma transação encontrada.
                </TableCell>
              </TableRow>
            )}
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="whitespace-nowrap">
                  {formatDate(transaction.date)}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {transaction.description}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {transaction.category?.name ?? "Outros"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span
                    className={
                      transaction.type === "receita"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }
                  >
                    {transaction.type === "receita" ? "Receita" : "Despesa"}
                  </span>
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
                    transaction.type === "receita"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "receita" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(transaction)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingTransaction(transaction)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TransactionFormDialog
        categories={categories}
        transaction={editingTransaction}
        open={formOpen}
        onOpenChange={setFormOpen}
      />

      {deletingTransaction && (
        <DeleteTransactionDialog
          transactionId={deletingTransaction.id}
          description={deletingTransaction.description}
          open={Boolean(deletingTransaction)}
          onOpenChange={(open) => {
            if (!open) setDeletingTransaction(undefined);
          }}
        />
      )}
    </>
  );
}

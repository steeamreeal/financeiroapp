"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  createTransaction,
  updateTransaction,
  type TransactionInput,
} from "@/app/dashboard/actions";
import type { Category, Transaction, TransactionType } from "@/lib/types";

interface TransactionFormDialogProps {
  categories: Category[];
  transaction?: Transaction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionFormDialog({
  categories,
  transaction,
  open,
  onOpenChange,
}: TransactionFormDialogProps) {
  const router = useRouter();
  const isEditing = Boolean(transaction);

  const [type, setType] = useState<TransactionType>(
    transaction?.type ?? "despesa"
  );
  const [description, setDescription] = useState(
    transaction?.description ?? ""
  );
  const [amount, setAmount] = useState(
    transaction ? String(transaction.amount) : ""
  );
  const [date, setDate] = useState(
    transaction?.date ?? new Date().toISOString().slice(0, 10)
  );
  const [categoryId, setCategoryId] = useState(
    transaction?.category_id ?? ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setType(transaction?.type ?? "despesa");
      setDescription(transaction?.description ?? "");
      setAmount(transaction ? String(transaction.amount) : "");
      setDate(transaction?.date ?? new Date().toISOString().slice(0, 10));
      setCategoryId(transaction?.category_id ?? "");
    }
  }, [open, transaction]);

  const filteredCategories = categories.filter((c) => c.type === type);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const input: TransactionInput = {
      description,
      amount: Number(amount),
      date,
      type,
      category_id: categoryId || null,
    };

    try {
      if (isEditing && transaction) {
        await updateTransaction(transaction.id, input);
        toast.success("Transação atualizada com sucesso.");
      } else {
        await createTransaction(input);
        toast.success("Transação criada com sucesso.");
      }
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao salvar transação."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar transação" : "Nova transação"}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da {type === "receita" ? "receita" : "despesa"}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs
            value={type}
            onValueChange={(v) => {
              setType(v as TransactionType);
              setCategoryId("");
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="despesa">Despesa</TabsTrigger>
              <TabsTrigger value="receita">Receita</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Supermercado"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Data</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={categoryId}
              onValueChange={(v) => setCategoryId(v ?? "")}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

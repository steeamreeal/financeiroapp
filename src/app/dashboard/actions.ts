"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ParsedTransaction, TransactionSource, TransactionType } from "@/lib/types";

export interface TransactionInput {
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category_id: string | null;
  notes?: string | null;
}

export async function createTransaction(input: TransactionInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autenticado.");

  const { error } = await supabase.from("transactions").insert({
    ...input,
    notes: input.notes || null,
    user_id: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transacoes");
}

export async function updateTransaction(id: string, input: TransactionInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autenticado.");

  const { error } = await supabase
    .from("transactions")
    .update({ ...input, notes: input.notes || null })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transacoes");
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autenticado.");

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transacoes");
}

export async function importTransactions(
  transactions: ParsedTransaction[],
  categoryId: string | null,
  source: TransactionSource
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autenticado.");
  if (transactions.length === 0) return { count: 0 };

  const rows = transactions.map((t) => ({
    description: t.description,
    amount: t.amount,
    date: t.date,
    type: t.type,
    category_id: categoryId,
    notes: t.notes || null,
    source,
    user_id: user.id,
  }));

  const { error } = await supabase.from("transactions").insert(rows);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/transacoes");

  return { count: rows.length };
}

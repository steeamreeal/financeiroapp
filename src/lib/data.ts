import { createClient } from "@/lib/supabase/server";
import type { Category, Transaction } from "@/lib/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface TransactionFilters {
  month?: number;
  year?: number;
  categoryId?: string;
  search?: string;
}

export async function getTransactions(
  filters: TransactionFilters = {}
): Promise<Transaction[]> {
  const supabase = await createClient();

  let query = supabase
    .from("transactions")
    .select("*, category:categories(*)")
    .order("date", { ascending: false });

  if (filters.year) {
    const month = filters.month ?? null;
    const start = month
      ? `${filters.year}-${String(month).padStart(2, "0")}-01`
      : `${filters.year}-01-01`;
    const endDate = month
      ? new Date(filters.year, month, 0)
      : new Date(filters.year, 11, 31);
    const end = endDate.toISOString().slice(0, 10);

    query = query.gte("date", start).lte("date", end);
  }

  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters.search) {
    query = query.ilike("description", `%${filters.search}%`);
  }

  const { data, error } = await query;

  if (error) throw new Error(error.message);
  return (data as unknown as Transaction[]) ?? [];
}

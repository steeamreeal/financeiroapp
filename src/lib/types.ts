export type TransactionType = "receita" | "despesa";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string | null;
}

export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category_id: string | null;
  created_at: string;
  category?: Category | null;
}

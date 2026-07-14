export type TransactionType = "receita" | "despesa";

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string | null;
}

export type TransactionSource = "manual" | "csv" | "ofx" | "ocr";

export interface Transaction {
  id: string;
  user_id: string;
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category_id: string | null;
  notes: string | null;
  source: TransactionSource;
  created_at: string;
  category?: Category | null;
}

export interface ParsedTransaction {
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  notes?: string;
}

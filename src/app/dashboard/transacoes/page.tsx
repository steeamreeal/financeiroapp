import { getCategories, getTransactions } from "@/lib/data";
import { PeriodSelect } from "@/components/dashboard/period-select";
import { CategoryFilter } from "@/components/transactions/category-filter";
import { SearchInput } from "@/components/transactions/search-input";
import { ExportCsvButton } from "@/components/transactions/export-csv-button";
import { TransactionsTable } from "@/components/transactions/transactions-table";

export default async function TransacoesPage({
  searchParams,
}: {
  searchParams: Promise<{
    month?: string;
    year?: string;
    categoryId?: string;
    search?: string;
  }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = Number(params.month) || now.getMonth() + 1;
  const year = Number(params.year) || now.getFullYear();
  const categoryId = params.categoryId ?? "";
  const search = params.search ?? "";

  const [categories, transactions] = await Promise.all([
    getCategories(),
    getTransactions({ month, year, categoryId, search }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Transações</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie suas receitas e despesas
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <PeriodSelect month={month} year={year} />
          <CategoryFilter categories={categories} value={categoryId} />
          <SearchInput initialValue={search} />
        </div>
        <ExportCsvButton transactions={transactions} />
      </div>

      <TransactionsTable transactions={transactions} categories={categories} />
    </div>
  );
}

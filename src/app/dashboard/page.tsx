import Link from "next/link";
import { TrendingUp, TrendingDown, Wallet, ArrowRight } from "lucide-react";
import { getTransactions } from "@/lib/data";
import { formatCurrency, formatDate, MONTHS_PT } from "@/lib/format";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PeriodSelect } from "@/components/dashboard/period-select";
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const month = Number(params.month) || now.getMonth() + 1;
  const year = Number(params.year) || now.getFullYear();

  const transactions = await getTransactions({ month, year });

  const totalReceitas = transactions
    .filter((t) => t.type === "receita")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalDespesas = transactions
    .filter((t) => t.type === "despesa")
    .reduce((sum, t) => sum + t.amount, 0);
  const saldo = totalReceitas - totalDespesas;

  const despesasPorCategoria = new Map<string, number>();
  transactions
    .filter((t) => t.type === "despesa")
    .forEach((t) => {
      const nome = t.category?.name ?? "Outros";
      despesasPorCategoria.set(
        nome,
        (despesasPorCategoria.get(nome) ?? 0) + t.amount
      );
    });
  const chartData = Array.from(despesasPorCategoria.entries()).map(
    ([name, value]) => ({ name, value })
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Visão geral</h1>
          <p className="text-sm text-muted-foreground">
            {MONTHS_PT[month - 1]} de {year}
          </p>
        </div>
        <PeriodSelect month={month} year={year} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Receitas</CardDescription>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(totalReceitas)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Despesas</CardDescription>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalDespesas)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardDescription>Saldo</CardDescription>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                saldo >= 0 ? "text-foreground" : "text-red-600"
              }`}
            >
              {formatCurrency(saldo)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Despesas por categoria</CardTitle>
            <CardDescription>
              Distribuição dos gastos no período selecionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryPieChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Receitas e despesas lançadas</CardTitle>
              <CardDescription>
                Tudo o que foi adicionado em {MONTHS_PT[month - 1].toLowerCase()}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              render={
                <Link href="/dashboard/transacoes">
                  Ver todas
                  <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              }
            />
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nenhuma receita ou despesa lançada neste período.
              </p>
            ) : (
              <ul className="max-h-[420px] divide-y divide-border overflow-y-auto">
                {transactions.map((transaction) => (
                  <li
                    key={transaction.id}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {transaction.description}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatDate(transaction.date)}</span>
                        <Badge variant="secondary" className="text-xs">
                          {transaction.category?.name ?? "Outros"}
                        </Badge>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 font-medium ${
                        transaction.type === "receita"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "receita" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

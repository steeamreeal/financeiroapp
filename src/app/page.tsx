import Link from "next/link";
import {
  Wallet,
  LineChart,
  Filter,
  Download,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: LineChart,
    title: "Dashboard visual",
    description:
      "Acompanhe receitas, despesas e saldo em cards claros, com gráfico de pizza por categoria.",
  },
  {
    icon: Filter,
    title: "Filtros poderosos",
    description:
      "Filtre transações por mês, ano, categoria ou busque por descrição em segundos.",
  },
  {
    icon: Download,
    title: "Exportação em CSV",
    description:
      "Exporte suas transações filtradas para uma planilha com um clique.",
  },
  {
    icon: ShieldCheck,
    title: "Seus dados, só seus",
    description:
      "Autenticação segura e Row Level Security garantem que só você vê suas informações.",
  },
  {
    icon: Smartphone,
    title: "100% responsivo",
    description:
      "Use no computador ou no celular com uma experiência adaptada para cada tela.",
  },
  {
    icon: Wallet,
    title: "Categorias prontas",
    description:
      "Alimentação, transporte, moradia, lazer, saúde e mais — já configuradas para você.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wallet className="h-4 w-4" />
            </div>
            Finanças Pessoais
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" render={<Link href="/login">Entrar</Link>} />
            <Button render={<Link href="/cadastro">Criar conta</Link>} />
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
          <h1 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Controle suas finanças de forma simples e visual
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">
            Registre receitas e despesas, acompanhe seu saldo mensal e tome
            decisões financeiras melhores — tudo em um só lugar.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              render={<Link href="/cadastro">Começar agora, é grátis</Link>}
            />
            <Button
              size="lg"
              variant="outline"
              render={<Link href="/login">Já tenho conta</Link>}
            />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-3">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Finanças Pessoais. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

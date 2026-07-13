import Link from "next/link";
import {
  Wallet,
  LineChart,
  Filter,
  Download,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ArrowRight,
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
    tint: "bg-[oklch(0.55_0.14_162)]/10 text-[oklch(0.44_0.12_162)]",
  },
  {
    icon: Filter,
    title: "Filtros poderosos",
    description:
      "Filtre transações por mês, ano, categoria ou busque por descrição em segundos.",
    tint: "bg-[oklch(0.6_0.11_230)]/10 text-[oklch(0.5_0.11_230)]",
  },
  {
    icon: Download,
    title: "Exportação em CSV",
    description:
      "Exporte suas transações filtradas para uma planilha com um clique.",
    tint: "bg-[oklch(0.58_0.15_320)]/10 text-[oklch(0.5_0.15_320)]",
  },
  {
    icon: ShieldCheck,
    title: "Seus dados, só seus",
    description:
      "Autenticação segura e Row Level Security garantem que só você vê suas informações.",
    tint: "bg-[oklch(0.55_0.14_162)]/10 text-[oklch(0.44_0.12_162)]",
  },
  {
    icon: Smartphone,
    title: "100% responsivo",
    description:
      "Use no computador ou no celular com uma experiência adaptada para cada tela.",
    tint: "bg-[oklch(0.62_0.2_26)]/10 text-[oklch(0.55_0.2_26)]",
  },
  {
    icon: Wallet,
    title: "Categorias prontas",
    description:
      "Alimentação, transporte, moradia, lazer, saúde e mais — já configuradas para você.",
    tint: "bg-accent/15 text-[oklch(0.5_0.15_50)]",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-heading text-lg font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30">
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
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-[oklch(0.55_0.14_162)]/25 blur-3xl" />
            <div className="absolute top-10 -right-16 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />
            <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[oklch(0.58_0.15_320)]/15 blur-3xl" />
          </div>

          <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:py-28">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Grátis para começar
            </span>
            <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Suas finanças, {" "}
              <span className="bg-gradient-to-r from-[oklch(0.44_0.12_162)] via-[oklch(0.6_0.15_120)] to-accent bg-clip-text text-transparent">
                sob controle
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground text-balance">
              Registre receitas e despesas, acompanhe seu saldo mensal e tome
              decisões financeiras melhores — tudo em um só lugar.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                size="lg"
                className="group shadow-lg shadow-primary/20"
                render={
                  <Link href="/cadastro">
                    Começar agora, é grátis
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                }
              />
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/login">Já tenho conta</Link>}
              />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card
                key={feature.title}
                className="border-border/70 transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.tint}`}
                  >
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="mt-3 font-heading text-base">
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/70 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Finanças Pessoais. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

import Link from "next/link";
import { Wallet } from "lucide-react";
import { login } from "../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-[oklch(0.55_0.14_162)]/20 blur-3xl" />
        <div className="absolute bottom-0 -right-16 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
      </div>
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold">Finanças Pessoais</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entrar</CardTitle>
            <CardDescription>
              Acesse sua conta para gerenciar suas finanças.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={login} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="voce@email.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              {params.error && (
                <p className="text-sm text-destructive">{params.error}</p>
              )}
              {params.message && (
                <p className="text-sm text-emerald-600">{params.message}</p>
              )}

              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Ainda não tem conta?{" "}
              <Link href="/cadastro" className="font-medium text-primary underline-offset-4 hover:underline">
                Cadastre-se
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

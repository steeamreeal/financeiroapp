import Link from "next/link";
import { KeyRound } from "lucide-react";
import { requestPasswordReset } from "../actions";
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

export default async function EsqueciSenhaPage({
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
            <KeyRound className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold">Finanças Pessoais</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Esqueceu sua senha?</CardTitle>
            <CardDescription>
              Informe seu e-mail e enviaremos um link para redefinir sua
              senha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={requestPasswordReset} className="space-y-4">
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

              {params.error && (
                <p className="text-sm text-destructive">{params.error}</p>
              )}
              {params.message && (
                <p className="text-sm text-emerald-600">{params.message}</p>
              )}

              <Button type="submit" className="w-full">
                Enviar link de recuperação
              </Button>
            </form>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Lembrou sua senha?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Voltar para o login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

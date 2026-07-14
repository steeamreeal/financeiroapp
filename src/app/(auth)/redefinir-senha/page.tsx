import { KeyRound } from "lucide-react";
import { resetPassword } from "../actions";
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

export default async function RedefinirSenhaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
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
            <CardTitle>Redefinir senha</CardTitle>
            <CardDescription>Escolha uma nova senha para sua conta.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={resetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>

              {params.error && (
                <p className="text-sm text-destructive">{params.error}</p>
              )}

              <Button type="submit" className="w-full">
                Salvar nova senha
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

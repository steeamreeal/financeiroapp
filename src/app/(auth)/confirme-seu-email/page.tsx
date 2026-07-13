import Link from "next/link";
import { MailCheck, Inbox, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function ConfirmeSeuEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-20 h-72 w-72 rounded-full bg-[oklch(0.55_0.14_162)]/20 blur-3xl" />
        <div className="absolute bottom-0 -right-16 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
      </div>

      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
            <MailCheck className="h-7 w-7" />
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-heading text-xl">
              Confirme seu e-mail
            </CardTitle>
            <CardDescription>
              Enviamos um link de confirmação para{" "}
              {params.email ? (
                <span className="font-medium text-foreground">
                  {params.email}
                </span>
              ) : (
                "o e-mail que você cadastrou"
              )}
              . Clique nele para ativar sua conta.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-lg border border-accent/30 bg-accent/10 p-3 text-sm">
              <Inbox className="mt-0.5 h-4 w-4 shrink-0 text-[oklch(0.5_0.15_50)]" />
              <p className="text-foreground/90">
                Não encontrou o e-mail? Verifique também a caixa de{" "}
                <strong>spam ou lixo eletrônico</strong> — mensagens de
                confirmação às vezes caem lá.
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm">
              <RefreshCw className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-foreground/90">
                Depois de confirmar, volte e faça login normalmente com seu
                e-mail e senha.
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full"
              render={<Link href="/login">Ir para o login</Link>}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

# Recuperação de senha (esqueci minha senha)

## Contexto

O app usa Supabase Auth com Server Actions (Next.js App Router). Hoje existem
apenas login (`/login`) e cadastro (`/cadastro`), com confirmação de e-mail
via `/confirme-seu-email`. Não há forma de o usuário redefinir a senha caso
a esqueça.

## Objetivo

Adicionar um fluxo de recuperação de senha por link de e-mail, seguindo o
padrão recomendado pelo Supabase para SSR (Next.js).

## Fluxo

1. **`/esqueci-senha`** (nova página)
   - Formulário com campo de e-mail.
   - Server Action `requestPasswordReset` chama
     `supabase.auth.resetPasswordForEmail(email, { redirectTo: <site>/auth/confirm?type=recovery&next=/redefinir-senha })`.
   - Sempre exibe a mesma mensagem de sucesso ("Se o e-mail existir em nossa
     base, enviaremos um link de recuperação"), **independente de o e-mail
     existir ou não** — decisão explícita para evitar enumeração de usuários
     em um app financeiro.
   - Erros de infraestrutura (ex.: falha ao enviar e-mail) podem ser
     exibidos normalmente; apenas a existência do e-mail não é revelada.

2. **`src/app/auth/confirm/route.ts`** (novo Route Handler)
   - Recebe `token_hash` e `type` (query params) do link enviado por e-mail.
   - Chama `supabase.auth.verifyOtp({ token_hash, type })`.
   - Sucesso: redireciona para `/redefinir-senha`.
   - Falha (link inválido/expirado): redireciona para
     `/esqueci-senha?error=Link inválido ou expirado. Solicite um novo.`

3. **`/redefinir-senha`** (nova página)
   - Formulário com campo de nova senha + confirmação (mesma validação de
     `minLength=6` usada hoje no login/cadastro).
   - Server Action `resetPassword` chama
     `supabase.auth.updateUser({ password })` usando a sessão de recovery
     criada pelo `verifyOtp` no passo anterior.
   - Sucesso: redireciona para `/login?message=Senha redefinida com sucesso. Faça login.`
   - Erro: redireciona de volta para `/redefinir-senha?error=...`.

## Mudanças em arquivos existentes

- **`src/app/(auth)/login/page.tsx`**: adicionar link "Esqueceu sua senha?"
  abaixo do campo de senha, apontando para `/esqueci-senha`.
- **`src/app/(auth)/actions.ts`**: adicionar `requestPasswordReset(formData)`
  e `resetPassword(formData)`.
- **`src/lib/supabase/middleware.ts`**: incluir `/esqueci-senha` no grupo de
  rotas de auth (usuário já logado normalmente é redirecionado para
  `/dashboard`). `/redefinir-senha` fica fora desse grupo, mas ainda exige
  usuário autenticado (sessão de recovery conta como autenticado) — sem essa
  sessão, a página deve redirecionar para `/esqueci-senha`.

## Segurança

- Mensagem genérica na solicitação de reset, sempre a mesma independente de
  o e-mail existir (confirmado com o usuário — decisão explícita, prioriza
  segurança sobre UX de feedback imediato).
- Nenhuma chave nova necessária; usa o client Supabase já configurado
  (`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
- Link de recovery expira conforme configuração padrão do Supabase (1h).
- Reaproveita o padrão visual (Card, Input, Button) já usado em login/cadastro.

## Fora de escopo

- Recuperação por SMS/OTP numérico.
- Página de "gerenciar conta" para troca de senha estando logado (fluxo
  diferente, não pedido aqui).

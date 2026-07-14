"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(`/cadastro?error=${encodeURIComponent(error.message)}`);
  }

  if (!data.session) {
    redirect(`/confirme-seu-email?email=${encodeURIComponent(email)}`);
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  const origin = (await headers()).get("origin");

  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/confirm?type=recovery&next=/redefinir-senha`,
  });

  // Mensagem sempre genérica, mesmo se o e-mail não existir na base,
  // para não permitir que alguém descubra e-mails cadastrados.
  redirect(
    "/esqueci-senha?message=" +
      encodeURIComponent(
        "Se o e-mail informado estiver cadastrado, você receberá um link para redefinir sua senha."
      )
  );
}

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    redirect(`/redefinir-senha?error=${encodeURIComponent(error.message)}`);
  }

  redirect(
    "/login?message=" +
      encodeURIComponent("Senha redefinida com sucesso. Faça login.")
  );
}

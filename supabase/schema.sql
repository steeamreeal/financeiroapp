-- Financas Pessoais - Schema PostgreSQL / Supabase
-- Execute este script no SQL Editor do Supabase.

create extension if not exists "pgcrypto";

-- Tipos
do $$ begin
  create type transaction_type as enum ('receita', 'despesa');
exception
  when duplicate_object then null;
end $$;

-- Categorias (globais, pré-definidas)
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  type transaction_type not null,
  icon text
);

insert into categories (name, type, icon) values
  ('Alimentação', 'despesa', 'utensils'),
  ('Transporte', 'despesa', 'car'),
  ('Moradia', 'despesa', 'home'),
  ('Lazer', 'despesa', 'party-popper'),
  ('Saúde', 'despesa', 'heart-pulse'),
  ('Educação', 'despesa', 'graduation-cap'),
  ('Salário', 'receita', 'wallet'),
  ('Freelance', 'receita', 'briefcase'),
  ('Outros', 'despesa', 'more-horizontal')
on conflict (name) do nothing;

-- Transações
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  description text not null,
  amount numeric(12,2) not null check (amount > 0),
  date date not null,
  type transaction_type not null,
  category_id uuid references categories(id),
  notes text,
  source text not null default 'manual',
  created_at timestamptz not null default now()
);

create index if not exists transactions_user_id_idx on transactions(user_id);
create index if not exists transactions_date_idx on transactions(date);

-- Row Level Security
alter table transactions enable row level security;
alter table categories enable row level security;

drop policy if exists "Usuários veem apenas suas transações" on transactions;
create policy "Usuários veem apenas suas transações"
  on transactions for select
  using (auth.uid() = user_id);

drop policy if exists "Usuários inserem apenas suas transações" on transactions;
create policy "Usuários inserem apenas suas transações"
  on transactions for insert
  with check (auth.uid() = user_id);

drop policy if exists "Usuários atualizam apenas suas transações" on transactions;
create policy "Usuários atualizam apenas suas transações"
  on transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Usuários excluem apenas suas transações" on transactions;
create policy "Usuários excluem apenas suas transações"
  on transactions for delete
  using (auth.uid() = user_id);

drop policy if exists "Categorias são visíveis para todos autenticados" on categories;
create policy "Categorias são visíveis para todos autenticados"
  on categories for select
  to authenticated
  using (true);

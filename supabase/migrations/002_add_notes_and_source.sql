-- Adiciona observações livres e origem do lançamento (manual, csv, ofx, ocr)
-- Execute no SQL Editor do Supabase se o projeto já tinha o schema anterior.

alter table transactions
  add column if not exists notes text;

alter table transactions
  add column if not exists source text not null default 'manual';

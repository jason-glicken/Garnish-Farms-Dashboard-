-- Garnish Farms v36: individual container records under each parent batch
-- Parent foreign key is BIGINT to match public.batches.id.
-- Run once in Supabase SQL Editor before creating new batches with v35.
create table if not exists public.batch_items (
  id uuid primary key default gen_random_uuid(),
  batch_id bigint not null references public.batches(id) on delete cascade,
  container_id text not null unique,
  strain text not null,
  date date not null,
  stage text not null default 'Grain Spawn',
  status text not null default 'Active',
  container text,
  substrate text,
  notes text,
  stage_history jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists batch_items_batch_id_idx on public.batch_items(batch_id);
create index if not exists batch_items_stage_idx on public.batch_items(stage);
-- Enable RLS and allow the same anon-key workflow currently used by this private farm dashboard.
alter table public.batch_items enable row level security;
drop policy if exists "Garnish Farms dashboard access" on public.batch_items;
create policy "Garnish Farms dashboard access" on public.batch_items for all using (true) with check (true);

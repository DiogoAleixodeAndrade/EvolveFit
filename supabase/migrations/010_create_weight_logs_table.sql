create table if not exists public.weight_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  weight_kg numeric not null,
  log_date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.weight_logs enable row level security;

create policy "Users can view own weight logs"
on public.weight_logs
for select
using (auth.uid() = user_id);

create policy "Users can insert own weight logs"
on public.weight_logs
for insert
with check (auth.uid() = user_id);

create policy "Users can delete own weight logs"
on public.weight_logs
for delete
using (auth.uid() = user_id);
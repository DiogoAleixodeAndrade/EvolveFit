create table if not exists public.water_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount_ml integer not null,
  log_date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.water_logs enable row level security;

create policy "Users can view own water logs"
on public.water_logs
for select
using (auth.uid() = user_id);

create policy "Users can insert own water logs"
on public.water_logs
for insert
with check (auth.uid() = user_id);

create policy "Users can delete own water logs"
on public.water_logs
for delete
using (auth.uid() = user_id);
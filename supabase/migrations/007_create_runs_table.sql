create table if not exists public.runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  distance_km numeric not null default 0,
  duration_minutes integer not null default 0,
  calories integer not null default 0,
  run_date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.runs enable row level security;

create policy "Users can view own runs"
on public.runs
for select
using (auth.uid() = user_id);

create policy "Users can insert own runs"
on public.runs
for insert
with check (auth.uid() = user_id);

create policy "Users can delete own runs"
on public.runs
for delete
using (auth.uid() = user_id);
create table if not exists public.user_streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak integer not null default 0,
  best_streak integer not null default 0,
  last_active_date date,
  updated_at timestamptz not null default now()
);

alter table public.user_streaks enable row level security;

create policy "Users can view own streak"
on public.user_streaks
for select
using (auth.uid() = user_id);

create policy "Users can insert own streak"
on public.user_streaks
for insert
with check (auth.uid() = user_id);

create policy "Users can update own streak"
on public.user_streaks
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
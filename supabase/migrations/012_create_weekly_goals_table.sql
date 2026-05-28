create table if not exists public.weekly_goals (
  user_id uuid primary key references auth.users(id) on delete cascade,
  meals_goal integer not null default 21,
  water_liters_goal numeric not null default 14,
  workouts_goal integer not null default 3,
  runs_goal integer not null default 2,
  distance_km_goal numeric not null default 10,
  updated_at timestamptz not null default now()
);

alter table public.weekly_goals enable row level security;

create policy "Users can view own weekly goals"
on public.weekly_goals
for select
using (auth.uid() = user_id);

create policy "Users can insert own weekly goals"
on public.weekly_goals
for insert
with check (auth.uid() = user_id);

create policy "Users can update own weekly goals"
on public.weekly_goals
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
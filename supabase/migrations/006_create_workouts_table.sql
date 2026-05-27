create table if not exists public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  duration_minutes integer not null default 60,
  calories integer not null default 0,
  workout_date date not null default current_date,
  completed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.workouts enable row level security;

create policy "Users can view own workouts"
on public.workouts
for select
using (auth.uid() = user_id);

create policy "Users can insert own workouts"
on public.workouts
for insert
with check (auth.uid() = user_id);

create policy "Users can update own workouts"
on public.workouts
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own workouts"
on public.workouts
for delete
using (auth.uid() = user_id);
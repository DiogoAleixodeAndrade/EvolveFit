create table if not exists public.meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text,
  protein_grams numeric not null default 0,
  carbs_grams numeric not null default 0,
  calories integer not null default 0,
  meal_date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.meals enable row level security;

create policy "Users can view own meals"
on public.meals
for select
using (auth.uid() = user_id);

create policy "Users can insert own meals"
on public.meals
for insert
with check (auth.uid() = user_id);

create policy "Users can delete own meals"
on public.meals
for delete
using (auth.uid() = user_id);
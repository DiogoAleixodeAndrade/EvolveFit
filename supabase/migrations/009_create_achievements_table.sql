create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_key text not null,
  title text not null,
  description text not null,
  unlocked_at timestamptz not null default now()
);

alter table public.user_achievements enable row level security;

create policy "Users can view own achievements"
on public.user_achievements
for select
using (auth.uid() = user_id);

create policy "Users can insert own achievements"
on public.user_achievements
for insert
with check (auth.uid() = user_id);
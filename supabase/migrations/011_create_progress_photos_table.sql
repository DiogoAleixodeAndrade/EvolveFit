create table if not exists public.progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  photo_path text not null,
  note text,
  photo_date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.progress_photos enable row level security;

create policy "Users can view own progress photos"
on public.progress_photos
for select
using (auth.uid() = user_id);

create policy "Users can insert own progress photos"
on public.progress_photos
for insert
with check (auth.uid() = user_id);

create policy "Users can delete own progress photos"
on public.progress_photos
for delete
using (auth.uid() = user_id);
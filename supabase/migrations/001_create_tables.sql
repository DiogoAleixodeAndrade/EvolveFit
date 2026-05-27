create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Caçador',
  age integer not null default 18,
  height_cm integer not null default 170,
  weight_kg numeric not null default 70,
  goal text not null default 'health',
  training_level text not null default 'beginner',
  total_xp integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mission_key text not null,
  title text not null,
  description text,
  xp integer not null default 0,
  completed boolean not null default false,
  mission_date date not null default current_date,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_type text not null,
  title text not null,
  summary text,
  recommendations jsonb not null default '[]',
  warnings jsonb not null default '[]',
  created_at timestamptz not null default now()
);
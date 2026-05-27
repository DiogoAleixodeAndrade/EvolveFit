create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles
for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can view own missions"
on public.daily_missions
for select
using (auth.uid() = user_id);

create policy "Users can insert own missions"
on public.daily_missions
for insert
with check (auth.uid() = user_id);

create policy "Users can update own missions"
on public.daily_missions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can view own ai plans"
on public.ai_plans
for select
using (auth.uid() = user_id);

create policy "Users can insert own ai plans"
on public.ai_plans
for insert
with check (auth.uid() = user_id);
-- KAT shared database. Every record lives in one table, grouped by school and collection.
-- Row level security: a signed-in staff member only ever sees and changes their own school's records.

create table if not exists public.docs (
  school_id  text not null,
  coll       text not null,
  id         text not null,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by uuid default auth.uid(),
  primary key (school_id, coll, id)
);
alter table public.docs replica identity full;

create table if not exists public.members (
  user_id    uuid primary key references auth.users on delete cascade,
  school_id  text not null,
  staff_code text not null,
  created_at timestamptz not null default now(),
  unique (school_id, staff_code)
);

alter table public.docs enable row level security;
alter table public.members enable row level security;

create or replace function public.my_school() returns text
language sql stable security definer set search_path = public as $$
  select school_id from public.members where user_id = auth.uid()
$$;

drop policy if exists "read own school" on public.docs;
drop policy if exists "add to own school" on public.docs;
drop policy if exists "change own school" on public.docs;
drop policy if exists "remove from own school" on public.docs;
create policy "read own school" on public.docs for select to authenticated using (school_id = public.my_school());
create policy "add to own school" on public.docs for insert to authenticated with check (school_id = public.my_school());
create policy "change own school" on public.docs for update to authenticated using (school_id = public.my_school()) with check (school_id = public.my_school());
create policy "remove from own school" on public.docs for delete to authenticated using (school_id = public.my_school());

drop policy if exists "see own membership" on public.members;
create policy "see own membership" on public.members for select to authenticated using (user_id = auth.uid());

-- Before signing in: is this symbol already in use, free to claim, or unknown at this school?
create or replace function public.symbol_status(p_school text, p_code text) returns text
language sql stable security definer set search_path = public as $$
  select case
    when exists (select 1 from public.members where school_id = p_school and staff_code = upper(p_code)) then 'claimed'
    when not exists (select 1 from public.docs where school_id = p_school and coll = 'staff') then 'new-school'
    when exists (select 1 from public.docs where school_id = p_school and coll = 'staff' and upper(data->>'code') = upper(p_code)) then 'free'
    else 'unknown' end
$$;

-- First sign-in: link the new login to that symbol at that school.
create or replace function public.claim_symbol(p_school text, p_code text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if public.symbol_status(p_school, p_code) not in ('free', 'new-school') then raise exception 'symbol not available'; end if;
  insert into public.members (user_id, school_id, staff_code) values (auth.uid(), p_school, upper(p_code));
end $$;

-- Admin: forget a symbol's login so that person chooses a new password at the next sign-in.
create or replace function public.reset_symbol(p_code text) returns void
language plpgsql security definer set search_path = public as $$
declare uid uuid;
begin
  if not exists (select 1 from public.members m join public.docs d on d.school_id = m.school_id and d.coll = 'staff' and upper(d.data->>'code') = m.staff_code
                 where m.user_id = auth.uid() and d.data->>'role' in ('office', 'admin')) then raise exception 'only the office or an admin can reset a password'; end if;
  select user_id into uid from public.members where school_id = public.my_school() and staff_code = upper(p_code);
  if uid is null then return; end if;
  delete from auth.users where id = uid;
end $$;

revoke execute on function public.symbol_status(text, text) from public;
revoke execute on function public.claim_symbol(text, text) from public;
revoke execute on function public.reset_symbol(text) from public;
revoke execute on function public.my_school() from public;
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.docs to authenticated;
grant select on public.members to authenticated;
grant execute on function public.symbol_status(text, text) to anon, authenticated;
grant execute on function public.claim_symbol(text, text) to authenticated;
grant execute on function public.reset_symbol(text) to authenticated;
grant execute on function public.my_school() to authenticated;

do $$ begin
  alter publication supabase_realtime add table public.docs;
exception when duplicate_object then null; end $$;

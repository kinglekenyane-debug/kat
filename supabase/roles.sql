-- KAT step 2: developer account, starting passwords, and admin-only records.
-- Run after schema.sql. Safe to run more than once.

create extension if not exists pgcrypto with schema extensions;

-- the developer (KK Lekenyane) can set up schools and their first admin
create table if not exists public.developers (
  user_id    uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now()
);
-- a starting password the admin gives a new staff member; they replace it at their first sign-in
create table if not exists public.invites (
  school_id  text not null,
  staff_code text not null,
  pw_hash    text not null,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  primary key (school_id, staff_code)
);
alter table public.developers enable row level security;
alter table public.invites enable row level security;
-- (no policies: nobody reads these tables directly, only through the functions below)

create or replace function public.is_developer() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.developers where user_id = auth.uid())
$$;

-- office clerks and the principal manage staff, classes and school settings
create or replace function public.is_school_admin(p_school text) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_developer() or exists (
    select 1 from public.members m
    join public.docs d on d.school_id = m.school_id and d.coll = 'staff' and upper(d.data->>'code') = m.staff_code
    where m.user_id = auth.uid() and m.school_id = p_school and d.data->>'role' in ('office', 'admin'))
$$;

drop policy if exists "read own school" on public.docs;
drop policy if exists "add to own school" on public.docs;
drop policy if exists "change own school" on public.docs;
drop policy if exists "remove from own school" on public.docs;
create policy "read own school" on public.docs for select to authenticated
  using (school_id = public.my_school() or public.is_developer());
create policy "add to own school" on public.docs for insert to authenticated
  with check (public.is_developer() or (school_id = public.my_school() and (coll not in ('staff', 'classes', 'settings') or public.is_school_admin(school_id))));
create policy "change own school" on public.docs for update to authenticated
  using (public.is_developer() or (school_id = public.my_school() and (coll not in ('staff', 'classes', 'settings') or public.is_school_admin(school_id))))
  with check (public.is_developer() or (school_id = public.my_school() and (coll not in ('staff', 'classes', 'settings') or public.is_school_admin(school_id))));
create policy "remove from own school" on public.docs for delete to authenticated
  using (public.is_developer() or (school_id = public.my_school() and (coll not in ('staff', 'classes', 'settings') or public.is_school_admin(school_id))));

-- before signing in: what does this symbol need?
--   claimed   has a login: type your password
--   invited   has a starting password from the admin: type it, then choose your own
--   free      on the staff list, but no starting password yet: ask the admin
--   no-school this school is not set up yet: the developer sets it up
--   unknown   not on this school's staff list
drop function if exists public.symbol_status(text, text);
create function public.symbol_status(p_school text, p_code text) returns text
language sql stable security definer set search_path = public as $$
  select case
    when exists (select 1 from public.members where school_id = p_school and staff_code = upper(p_code)) then 'claimed'
    when exists (select 1 from public.invites where school_id = p_school and staff_code = upper(p_code)) then 'invited'
    when not exists (select 1 from public.docs where school_id = p_school and coll = 'staff') then 'no-school'
    when exists (select 1 from public.docs where school_id = p_school and coll = 'staff' and upper(data->>'code') = upper(p_code)) then 'free'
    else 'unknown' end
$$;

create or replace function public.check_start(p_school text, p_code text, p_start text) returns boolean
language sql stable security definer set search_path = public, extensions as $$
  select exists (select 1 from public.invites where school_id = p_school and staff_code = upper(p_code) and pw_hash = extensions.crypt(p_start, pw_hash))
$$;

-- first sign-in: the starting password must match; the new login takes over the symbol
drop function if exists public.claim_symbol(text, text);
create or replace function public.claim_symbol(p_school text, p_code text, p_start text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if not public.check_start(p_school, p_code, p_start) then raise exception 'the starting password is wrong'; end if;
  delete from public.members where school_id = p_school and staff_code = upper(p_code);
  insert into public.members (user_id, school_id, staff_code) values (auth.uid(), p_school, upper(p_code));
  delete from public.invites where school_id = p_school and staff_code = upper(p_code);
end $$;

-- admin (or developer): give a staff member a starting password. This also ends any old login for that symbol.
create or replace function public.set_start_password(p_school text, p_code text, p_pw text) returns void
language plpgsql security definer set search_path = public, extensions as $$
begin
  if not public.is_school_admin(p_school) then raise exception 'only an admin can give starting passwords'; end if;
  if length(coalesce(p_pw, '')) < 6 then raise exception 'use at least 6 characters'; end if;
  delete from auth.users where id in (select user_id from public.members where school_id = p_school and staff_code = upper(p_code))
     or email = lower(p_code) || '.' || p_school || '@kat.invalid';
  insert into public.invites (school_id, staff_code, pw_hash) values (p_school, upper(p_code), extensions.crypt(p_pw, extensions.gen_salt('bf')))
    on conflict (school_id, staff_code) do update set pw_hash = excluded.pw_hash, created_by = auth.uid(), created_at = now();
end $$;

-- the very first developer login claims the developer role; after that nobody else can
create or replace function public.claim_developer() returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if exists (select 1 from public.developers) and not public.is_developer() then raise exception 'there is already a developer'; end if;
  insert into public.developers (user_id) values (auth.uid()) on conflict do nothing;
end $$;
create or replace function public.developer_exists() returns boolean
language sql stable security definer set search_path = public as $$ select exists (select 1 from public.developers) $$;

-- developer overview: how many staff, learners and logins each school has
create or replace function public.school_overview() returns table (school_id text, staff bigint, learners bigint, logins bigint, invites bigint)
language sql stable security definer set search_path = public as $$
  select s.school_id,
    (select count(*) from public.docs d where d.school_id = s.school_id and d.coll = 'staff'),
    (select count(*) from public.docs d where d.school_id = s.school_id and d.coll = 'learners'),
    (select count(*) from public.members m where m.school_id = s.school_id),
    (select count(*) from public.invites i where i.school_id = s.school_id)
  from (select distinct school_id from public.docs union select distinct school_id from public.members) s
  where public.is_developer()
$$;

-- developer: wipe a test school completely (records and logins)
create or replace function public.wipe_school(p_school text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_developer() then raise exception 'only the developer can do this'; end if;
  delete from auth.users where id in (select user_id from public.members where school_id = p_school);
  delete from public.invites where school_id = p_school;
  delete from public.docs where school_id = p_school;
end $$;

drop function if exists public.reset_symbol(text);

revoke execute on function public.is_developer() from public;
revoke execute on function public.is_school_admin(text) from public;
revoke execute on function public.symbol_status(text, text) from public;
revoke execute on function public.check_start(text, text, text) from public;
revoke execute on function public.claim_symbol(text, text, text) from public;
revoke execute on function public.set_start_password(text, text, text) from public;
revoke execute on function public.claim_developer() from public;
revoke execute on function public.developer_exists() from public;
revoke execute on function public.school_overview() from public;
revoke execute on function public.wipe_school(text) from public;
grant execute on function public.is_developer() to authenticated;
grant execute on function public.is_school_admin(text) to authenticated;
grant execute on function public.symbol_status(text, text) to anon, authenticated;
grant execute on function public.check_start(text, text, text) to anon, authenticated;
grant execute on function public.claim_symbol(text, text, text) to authenticated;
grant execute on function public.set_start_password(text, text, text) to authenticated;
grant execute on function public.claim_developer() to authenticated;
grant execute on function public.developer_exists() to anon, authenticated;
grant execute on function public.school_overview() to authenticated;
grant execute on function public.wipe_school(text) to authenticated;

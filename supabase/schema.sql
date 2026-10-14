-- CahyanaPool database schema for Supabase PostgreSQL.
-- Run in Supabase SQL Editor after creating the project.
-- Storage access policies are intentionally separate; keep the portfolio bucket private
-- until signed-URL delivery for published and draft photos is implemented.

create extension if not exists pgcrypto;

create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key,
  label text not null,
  sort_order integer not null default 0
);

insert into public.categories (id, label, sort_order) values
  ('kolam-renang', 'Kolam Renang', 1),
  ('kolam-ikan', 'Kolam Ikan', 2),
  ('taman', 'Taman', 3),
  ('renovasi', 'Renovasi', 4)
on conflict (id) do update set label = excluded.label, sort_order = excluded.sort_order;

create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  alt_text text not null,
  storage_path text not null unique,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.photo_categories (
  photo_id uuid not null references public.photos(id) on delete cascade,
  category_id text not null references public.categories(id) on delete restrict,
  primary key (photo_id, category_id)
);

create table if not exists public.featured_photos (
  category_id text primary key references public.categories(id) on delete cascade,
  photo_id uuid not null references public.photos(id) on delete cascade,
  updated_at timestamptz not null default now()
);

create or replace function public.is_cahyanapool_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

alter table public.user_roles enable row level security;
alter table public.categories enable row level security;
alter table public.photos enable row level security;
alter table public.photo_categories enable row level security;
alter table public.featured_photos enable row level security;

drop policy if exists "Admins can read roles" on public.user_roles;
create policy "Admins can read roles" on public.user_roles
  for select to authenticated using (public.is_cahyanapool_admin());

drop policy if exists "Anyone can read categories" on public.categories;
create policy "Anyone can read categories" on public.categories
  for select to anon, authenticated using (true);

drop policy if exists "Admins manage categories" on public.categories;
create policy "Admins manage categories" on public.categories
  for all to authenticated using (public.is_cahyanapool_admin())
  with check (public.is_cahyanapool_admin());

drop policy if exists "Public can read published photos" on public.photos;
create policy "Public can read published photos" on public.photos
  for select to anon, authenticated using (
    status = 'published' or public.is_cahyanapool_admin()
  );

drop policy if exists "Admins manage photos" on public.photos;
create policy "Admins manage photos" on public.photos
  for all to authenticated using (public.is_cahyanapool_admin())
  with check (public.is_cahyanapool_admin());

drop policy if exists "Public can read categories for published photos" on public.photo_categories;
create policy "Public can read categories for published photos" on public.photo_categories
  for select to anon, authenticated using (
    exists (
      select 1 from public.photos p
      where p.id = photo_id and (
        p.status = 'published' or public.is_cahyanapool_admin()
      )
    )
  );

drop policy if exists "Admins manage photo categories" on public.photo_categories;
create policy "Admins manage photo categories" on public.photo_categories
  for all to authenticated using (public.is_cahyanapool_admin())
  with check (public.is_cahyanapool_admin());

drop policy if exists "Public can read featured published photos" on public.featured_photos;
create policy "Public can read featured published photos" on public.featured_photos
  for select to anon, authenticated using (
    exists (
      select 1 from public.photos p
      where p.id = photo_id and (
        p.status = 'published' or public.is_cahyanapool_admin()
      )
    )
  );

drop policy if exists "Admins manage featured photos" on public.featured_photos;
create policy "Admins manage featured photos" on public.featured_photos
  for all to authenticated using (public.is_cahyanapool_admin())
  with check (public.is_cahyanapool_admin());

-- IMPORTANT:
-- 1. Create an Auth user for the owner.
-- 2. Insert that user's UUID into public.user_roles with role='admin' using SQL Editor.
-- 3. Do not expose service_role keys in the frontend.
-- 4. Create a PRIVATE Storage bucket named 'portfolio'. Add storage policies only after
--    implementing authenticated upload and signed-URL delivery.

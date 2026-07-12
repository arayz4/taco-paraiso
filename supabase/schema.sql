-- TACOS PARAÍSO / タコパライソ
-- Run this SQL in the Supabase SQL editor.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'viewer' check (role in ('viewer', 'editor', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_en text,
  area text not null,
  taco_name text not null,
  rating integer not null check (rating between 1 and 5),
  atmosphere_rating integer check (atmosphere_rating between 1 and 5),
  scene_tags text[] not null default '{}',
  comment text not null,
  comment_en text,
  google_maps_url text,
  image_url text,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists restaurants_created_at_idx on public.restaurants(created_at desc);
create index if not exists restaurants_rating_idx on public.restaurants(rating desc);

alter table public.restaurants
  add column if not exists atmosphere_rating integer check (atmosphere_rating between 1 and 5);

alter table public.restaurants
  add column if not exists scene_tags text[] not null default '{}';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_restaurants_updated_at on public.restaurants;
create trigger set_restaurants_updated_at
before update on public.restaurants
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)),
    'viewer'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_editor()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('editor', 'admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.restaurants enable row level security;

drop policy if exists "Profiles are readable by everyone" on public.profiles;
create policy "Profiles are readable by everyone"
on public.profiles for select
using (true);

drop policy if exists "Editors can insert profiles" on public.profiles;
create policy "Editors can insert profiles"
on public.profiles for insert
with check (public.is_editor());

drop policy if exists "Editors can update profiles" on public.profiles;
create policy "Editors can update profiles"
on public.profiles for update
using (public.is_editor())
with check (public.is_editor());

drop policy if exists "Admins can delete profiles" on public.profiles;
create policy "Admins can delete profiles"
on public.profiles for delete
using (public.is_admin());

drop policy if exists "Restaurants are readable by everyone" on public.restaurants;
create policy "Restaurants are readable by everyone"
on public.restaurants for select
using (true);

drop policy if exists "Editors can insert restaurants" on public.restaurants;
create policy "Editors can insert restaurants"
on public.restaurants for insert
to authenticated
with check (public.is_editor() and created_by = auth.uid());

drop policy if exists "Editors can update restaurants" on public.restaurants;
create policy "Editors can update restaurants"
on public.restaurants for update
to authenticated
using (public.is_editor())
with check (public.is_editor());

drop policy if exists "Editors can delete restaurants" on public.restaurants;
create policy "Editors can delete restaurants"
on public.restaurants for delete
to authenticated
using (public.is_editor());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'restaurant-photos',
  'restaurant-photos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Restaurant photos are publicly readable" on storage.objects;
create policy "Restaurant photos are publicly readable"
on storage.objects for select
using (bucket_id = 'restaurant-photos');

drop policy if exists "Editors can upload restaurant photos" on storage.objects;
create policy "Editors can upload restaurant photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'restaurant-photos' and public.is_editor());

drop policy if exists "Editors can update restaurant photos" on storage.objects;
create policy "Editors can update restaurant photos"
on storage.objects for update
to authenticated
using (bucket_id = 'restaurant-photos' and public.is_editor())
with check (bucket_id = 'restaurant-photos' and public.is_editor());

drop policy if exists "Editors can delete restaurant photos" on storage.objects;
create policy "Editors can delete restaurant photos"
on storage.objects for delete
to authenticated
using (bucket_id = 'restaurant-photos' and public.is_editor());

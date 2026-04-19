-- Love Memory Space schema
-- Run this in your Supabase SQL Editor after creating the project.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.app_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  couple_title text not null default 'Love Memory Space',
  tagline text,
  quote text,
  hero_image_url text,
  public_slug text unique,
  is_public boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.relationship_info (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  start_date date,
  first_meet_date date,
  story text,
  love_quote text,
  location_label text,
  is_public boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('person_a', 'person_b')),
  full_name text not null,
  nickname text,
  birth_date date,
  description text,
  hobbies text[] default '{}'::text[],
  favorite_thing text,
  adorable_habit text,
  avatar_url text,
  is_public boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, role)
);

create table if not exists public.anniversaries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  event_date date not null,
  note text,
  is_public boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.timeline_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  event_date date not null,
  description text,
  media_url text,
  media_bucket_path text,
  tag text,
  is_public boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.gallery_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  caption text,
  media_url text not null,
  media_bucket_path text,
  media_type text not null check (media_type in ('image', 'video')),
  album text,
  taken_at timestamptz,
  is_favorite boolean not null default false,
  is_public boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  mood text,
  written_by text,
  entry_date date not null default current_date,
  attachment_url text,
  attachment_bucket_path text,
  is_public boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.letters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  sender_name text,
  entry_date date not null default current_date,
  attachment_url text,
  attachment_bucket_path text,
  is_public boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.places_visited (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  place_name text not null,
  city text,
  visited_at date,
  description text,
  image_url text,
  image_bucket_path text,
  is_memorable boolean not null default true,
  is_public boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bucket_list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  note text,
  status text not null default 'todo' check (status in ('todo', 'planned', 'done')),
  target_date date,
  is_public boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists anniversaries_user_id_idx on public.anniversaries(user_id);
create index if not exists gallery_items_user_id_idx on public.gallery_items(user_id);
create index if not exists timeline_events_user_id_idx on public.timeline_events(user_id);
create index if not exists journal_entries_user_id_idx on public.journal_entries(user_id);
create index if not exists letters_user_id_idx on public.letters(user_id);
create index if not exists places_visited_user_id_idx on public.places_visited(user_id);
create index if not exists bucket_list_items_user_id_idx on public.bucket_list_items(user_id);

drop trigger if exists set_updated_at_app_settings on public.app_settings;
create trigger set_updated_at_app_settings
before update on public.app_settings
for each row
execute function public.set_updated_at();

drop trigger if exists set_updated_at_relationship_info on public.relationship_info;
create trigger set_updated_at_relationship_info
before update on public.relationship_info
for each row
execute function public.set_updated_at();

drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles
before update on public.profiles
for each row
execute function public.set_updated_at();

drop trigger if exists set_updated_at_anniversaries on public.anniversaries;
create trigger set_updated_at_anniversaries
before update on public.anniversaries
for each row
execute function public.set_updated_at();

drop trigger if exists set_updated_at_timeline_events on public.timeline_events;
create trigger set_updated_at_timeline_events
before update on public.timeline_events
for each row
execute function public.set_updated_at();

drop trigger if exists set_updated_at_gallery_items on public.gallery_items;
create trigger set_updated_at_gallery_items
before update on public.gallery_items
for each row
execute function public.set_updated_at();

drop trigger if exists set_updated_at_journal_entries on public.journal_entries;
create trigger set_updated_at_journal_entries
before update on public.journal_entries
for each row
execute function public.set_updated_at();

drop trigger if exists set_updated_at_letters on public.letters;
create trigger set_updated_at_letters
before update on public.letters
for each row
execute function public.set_updated_at();

drop trigger if exists set_updated_at_places_visited on public.places_visited;
create trigger set_updated_at_places_visited
before update on public.places_visited
for each row
execute function public.set_updated_at();

drop trigger if exists set_updated_at_bucket_list_items on public.bucket_list_items;
create trigger set_updated_at_bucket_list_items
before update on public.bucket_list_items
for each row
execute function public.set_updated_at();

alter table public.app_settings enable row level security;
alter table public.relationship_info enable row level security;
alter table public.profiles enable row level security;
alter table public.anniversaries enable row level security;
alter table public.timeline_events enable row level security;
alter table public.gallery_items enable row level security;
alter table public.journal_entries enable row level security;
alter table public.letters enable row level security;
alter table public.places_visited enable row level security;
alter table public.bucket_list_items enable row level security;

drop policy if exists "app_settings_select" on public.app_settings;
create policy "app_settings_select"
on public.app_settings
for select
using (is_public = true or auth.uid() = user_id);

drop policy if exists "app_settings_insert" on public.app_settings;
create policy "app_settings_insert"
on public.app_settings
for insert
with check (auth.uid() = user_id);

drop policy if exists "app_settings_update" on public.app_settings;
create policy "app_settings_update"
on public.app_settings
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "app_settings_delete" on public.app_settings;
create policy "app_settings_delete"
on public.app_settings
for delete
using (auth.uid() = user_id);

drop policy if exists "relationship_select" on public.relationship_info;
create policy "relationship_select"
on public.relationship_info
for select
using (is_public = true or auth.uid() = user_id);

drop policy if exists "relationship_insert" on public.relationship_info;
create policy "relationship_insert"
on public.relationship_info
for insert
with check (auth.uid() = user_id);

drop policy if exists "relationship_update" on public.relationship_info;
create policy "relationship_update"
on public.relationship_info
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "relationship_delete" on public.relationship_info;
create policy "relationship_delete"
on public.relationship_info
for delete
using (auth.uid() = user_id);

drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select"
on public.profiles
for select
using (is_public = true or auth.uid() = user_id);

drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert"
on public.profiles
for insert
with check (auth.uid() = user_id);

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update"
on public.profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "profiles_delete" on public.profiles;
create policy "profiles_delete"
on public.profiles
for delete
using (auth.uid() = user_id);

drop policy if exists "anniversaries_select" on public.anniversaries;
create policy "anniversaries_select"
on public.anniversaries
for select
using (is_public = true or auth.uid() = user_id);

drop policy if exists "anniversaries_insert" on public.anniversaries;
create policy "anniversaries_insert"
on public.anniversaries
for insert
with check (auth.uid() = user_id);

drop policy if exists "anniversaries_update" on public.anniversaries;
create policy "anniversaries_update"
on public.anniversaries
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "anniversaries_delete" on public.anniversaries;
create policy "anniversaries_delete"
on public.anniversaries
for delete
using (auth.uid() = user_id);

drop policy if exists "timeline_select" on public.timeline_events;
create policy "timeline_select"
on public.timeline_events
for select
using (is_public = true or auth.uid() = user_id);

drop policy if exists "timeline_insert" on public.timeline_events;
create policy "timeline_insert"
on public.timeline_events
for insert
with check (auth.uid() = user_id);

drop policy if exists "timeline_update" on public.timeline_events;
create policy "timeline_update"
on public.timeline_events
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "timeline_delete" on public.timeline_events;
create policy "timeline_delete"
on public.timeline_events
for delete
using (auth.uid() = user_id);

drop policy if exists "gallery_select" on public.gallery_items;
create policy "gallery_select"
on public.gallery_items
for select
using (is_public = true or auth.uid() = user_id);

drop policy if exists "gallery_insert" on public.gallery_items;
create policy "gallery_insert"
on public.gallery_items
for insert
with check (auth.uid() = user_id);

drop policy if exists "gallery_update" on public.gallery_items;
create policy "gallery_update"
on public.gallery_items
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "gallery_delete" on public.gallery_items;
create policy "gallery_delete"
on public.gallery_items
for delete
using (auth.uid() = user_id);

drop policy if exists "journal_select" on public.journal_entries;
create policy "journal_select"
on public.journal_entries
for select
using (is_public = true or auth.uid() = user_id);

drop policy if exists "journal_insert" on public.journal_entries;
create policy "journal_insert"
on public.journal_entries
for insert
with check (auth.uid() = user_id);

drop policy if exists "journal_update" on public.journal_entries;
create policy "journal_update"
on public.journal_entries
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "journal_delete" on public.journal_entries;
create policy "journal_delete"
on public.journal_entries
for delete
using (auth.uid() = user_id);

drop policy if exists "letters_select" on public.letters;
create policy "letters_select"
on public.letters
for select
using (is_public = true or auth.uid() = user_id);

drop policy if exists "letters_insert" on public.letters;
create policy "letters_insert"
on public.letters
for insert
with check (auth.uid() = user_id);

drop policy if exists "letters_update" on public.letters;
create policy "letters_update"
on public.letters
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "letters_delete" on public.letters;
create policy "letters_delete"
on public.letters
for delete
using (auth.uid() = user_id);

drop policy if exists "places_select" on public.places_visited;
create policy "places_select"
on public.places_visited
for select
using (is_public = true or auth.uid() = user_id);

drop policy if exists "places_insert" on public.places_visited;
create policy "places_insert"
on public.places_visited
for insert
with check (auth.uid() = user_id);

drop policy if exists "places_update" on public.places_visited;
create policy "places_update"
on public.places_visited
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "places_delete" on public.places_visited;
create policy "places_delete"
on public.places_visited
for delete
using (auth.uid() = user_id);

drop policy if exists "bucket_select" on public.bucket_list_items;
create policy "bucket_select"
on public.bucket_list_items
for select
using (is_public = true or auth.uid() = user_id);

drop policy if exists "bucket_insert" on public.bucket_list_items;
create policy "bucket_insert"
on public.bucket_list_items
for insert
with check (auth.uid() = user_id);

drop policy if exists "bucket_update" on public.bucket_list_items;
create policy "bucket_update"
on public.bucket_list_items
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "bucket_delete" on public.bucket_list_items;
create policy "bucket_delete"
on public.bucket_list_items
for delete
using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('covers', 'covers', true),
  ('memories', 'memories', true),
  ('attachments', 'attachments', true)
on conflict (id) do nothing;

drop policy if exists "public_read_storage" on storage.objects;
create policy "public_read_storage"
on storage.objects
for select
using (bucket_id in ('avatars', 'covers', 'memories', 'attachments'));

drop policy if exists "auth_insert_storage" on storage.objects;
create policy "auth_insert_storage"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('avatars', 'covers', 'memories', 'attachments')
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "auth_update_storage" on storage.objects;
create policy "auth_update_storage"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('avatars', 'covers', 'memories', 'attachments')
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id in ('avatars', 'covers', 'memories', 'attachments')
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "auth_delete_storage" on storage.objects;
create policy "auth_delete_storage"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('avatars', 'covers', 'memories', 'attachments')
  and (storage.foldername(name))[1] = auth.uid()::text
);

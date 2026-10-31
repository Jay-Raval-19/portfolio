-- Photos (darkroom gallery) table + storage bucket.
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).

create table if not exists public.photos (
  id          uuid primary key default gen_random_uuid(),
  title       text not null default '',
  caption     text not null default '',
  location    text not null default '',
  date        text not null default '',
  aspect      text not null default '4/5',  -- 4/5 | 3/2 | 1/1 | 16/9 | 2/3
  image_url   text not null default '',
  image_path  text not null default '',     -- storage object path, used for deletion
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

-- Public, read-only access for the live gallery (anon key).
alter table public.photos enable row level security;

drop policy if exists "public read photos" on public.photos;
create policy "public read photos"
  on public.photos
  for select
  using (true);

-- Public storage bucket for the image files. Uploads/deletes are performed
-- server-side with the service-role key, which bypasses storage RLS.
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do update set public = true;

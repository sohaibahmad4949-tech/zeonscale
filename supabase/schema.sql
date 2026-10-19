-- Zeon Scale Agency: paste into Supabase > SQL Editor > Run. Safe to run again.

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) <= 200),
  email text not null check (char_length(email) <= 320),
  message text not null check (char_length(message) <= 5000)
);
create table if not exists quote_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) <= 200),
  email text not null check (char_length(email) <= 320),
  phone text,
  services text[] not null,
  budget text,
  message text not null check (char_length(message) <= 5000)
);
alter table contact_messages add column if not exists status text not null default 'new' check (status in ('new','read','archived'));
alter table contact_messages add column if not exists notes text;
alter table quote_requests  add column if not exists status text not null default 'new' check (status in ('new','contacted','won','lost'));
alter table quote_requests  add column if not exists notes text;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  category text not null,
  description text not null,
  scope text[] not null default '{}',
  demo boolean not null default false,
  published boolean not null default false,
  sort_order int not null default 0
);
create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  role text,
  quote text not null,
  published boolean not null default false
);

-- Reviews: visitors submit as 'pending'; they only show on the website after an admin approves them.
alter table testimonials add column if not exists rating int check (rating between 1 and 5);
alter table testimonials add column if not exists email text;
alter table testimonials add column if not exists status text not null default 'approved' check (status in ('pending','approved','rejected'));

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  slug text not null unique,
  title text not null,
  description text not null,
  icon text not null default 'Layers',
  published boolean not null default true,
  sort_order int not null default 0
);
alter table services add column if not exists features text[] not null default '{}';
insert into services (slug, title, description, icon, sort_order) values
  ('seo','SEO & Content Writing','Search-friendly pages and articles written to be found, read and trusted.','Search',1),
  ('wordpress','WordPress Development','Custom themes and easy-to-edit sites your team can manage without a developer.','Globe',2),
  ('shopify','Shopify Store Development','Stores built for clear product pages, fast checkout and simple catalog management.','ShoppingBag',3),
  ('custom','Custom Web Development','React and modern web apps for ideas that templates cannot handle.','Code2',4),
  ('marketing','Digital Marketing','Campaigns and channels planned around the customers you want to reach.','Megaphone',5),
  ('design','Graphic Design','Logos, social creatives and brand assets that look consistent everywhere.','Palette',6)
on conflict (slug) do nothing;

-- Project videos / posters, SEO overrides and first-party analytics (safe to run again)
alter table projects add column if not exists video_url text;
alter table projects add column if not exists poster_url text;

create table if not exists seo_pages (
  path text primary key,
  title text check (char_length(title) <= 120),
  description text check (char_length(description) <= 320),
  noindex boolean not null default false,
  updated_at timestamptz not null default now()
);
create table if not exists page_views (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  session_id text not null check (char_length(session_id) <= 64),
  path text not null check (char_length(path) <= 300),
  referrer text check (char_length(referrer) <= 300),
  device text check (device in ('mobile','tablet','desktop'))
);
create index if not exists page_views_created_idx on page_views (created_at desc);

-- Public bucket for project videos and posters (uploaded from Admin > Projects)
insert into storage.buckets (id, name, public) values ('project-media', 'project-media', true) on conflict (id) do nothing;

-- Who counts as an admin
create table if not exists admin_users (user_id uuid primary key references auth.users(id) on delete cascade);
create or replace function is_admin() returns boolean
  language sql security definer set search_path = public stable
  as $$ select exists (select 1 from admin_users where user_id = auth.uid()) $$;

alter table contact_messages enable row level security;
alter table quote_requests  enable row level security;
alter table projects        enable row level security;
alter table testimonials    enable row level security;
alter table services        enable row level security;
alter table admin_users     enable row level security;
alter table seo_pages       enable row level security;
alter table page_views      enable row level security;

drop policy if exists "public can submit" on contact_messages;
drop policy if exists "public can submit" on quote_requests;
drop policy if exists "visitors submit" on contact_messages;
drop policy if exists "visitors submit" on quote_requests;
create policy "visitors submit" on contact_messages for insert to anon with check (status = 'new');
create policy "visitors submit" on quote_requests  for insert to anon with check (status = 'new');

drop policy if exists "visitors submit reviews" on testimonials;
create policy "visitors submit reviews" on testimonials for insert to anon with check (
  status = 'pending' and published = false and char_length(name) <= 100 and char_length(quote) between 10 and 1000
  and (rating is null or rating between 1 and 5));

drop policy if exists "admins manage" on contact_messages;
drop policy if exists "admins manage" on quote_requests;
drop policy if exists "admins manage" on projects;
drop policy if exists "admins manage" on testimonials;
drop policy if exists "admins manage" on services;
create policy "admins manage" on contact_messages for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins manage" on quote_requests  for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins manage" on projects        for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins manage" on testimonials    for all to authenticated using (is_admin()) with check (is_admin());
create policy "admins manage" on services        for all to authenticated using (is_admin()) with check (is_admin());

drop policy if exists "admins manage" on seo_pages;
create policy "admins manage" on seo_pages for all to authenticated using (is_admin()) with check (is_admin());
drop policy if exists "public reads seo" on seo_pages;
create policy "public reads seo" on seo_pages for select to anon, authenticated using (true);
drop policy if exists "visitors log views" on page_views;
create policy "visitors log views" on page_views for insert to anon, authenticated with check (true);
drop policy if exists "admins read views" on page_views;
create policy "admins read views" on page_views for select to authenticated using (is_admin());
drop policy if exists "admins delete views" on page_views;
create policy "admins delete views" on page_views for delete to authenticated using (is_admin());

drop policy if exists "public reads project media" on storage.objects;
create policy "public reads project media" on storage.objects for select to anon, authenticated using (bucket_id = 'project-media');
drop policy if exists "admins upload project media" on storage.objects;
create policy "admins upload project media" on storage.objects for insert to authenticated with check (bucket_id = 'project-media' and is_admin());
drop policy if exists "admins delete project media" on storage.objects;
create policy "admins delete project media" on storage.objects for delete to authenticated using (bucket_id = 'project-media' and is_admin());

drop policy if exists "public reads published" on projects;
drop policy if exists "public reads published" on testimonials;
drop policy if exists "public reads published" on services;
create policy "public reads published" on projects     for select to anon, authenticated using (published);
create policy "public reads published" on testimonials for select to anon, authenticated using (published);
create policy "public reads published" on services     for select to anon, authenticated using (published);

drop policy if exists "read own admin row" on admin_users;
create policy "read own admin row" on admin_users for select to authenticated using (user_id = auth.uid());

-- LAST STEP: create your admin login in Authentication > Users (email + password), then run this
-- with your own email:
-- insert into admin_users (user_id) select id from auth.users where email = 'you@example.com';

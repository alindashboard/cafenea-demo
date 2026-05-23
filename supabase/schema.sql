-- ============================================================
-- Brew & Bean — Schema Supabase
-- Run in Supabase SQL Editor (copy-paste the whole file)
-- ============================================================

-- Menu categories
create table if not exists public.menu_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  icon        text,
  sort_order  integer not null default 0,
  visible     boolean not null default true,
  created_at  timestamptz not null default now()
);

-- Menu items (produse)
create table if not exists public.items (
  id           uuid primary key default gen_random_uuid(),
  category_id  uuid references public.menu_categories(id) on delete set null,
  name         text not null,
  description  text,
  price        numeric(10, 2) not null default 0,
  price_unit   text,
  image_url    text,
  available    boolean not null default true,
  is_popular   boolean not null default false,
  features     text[],
  allergens    text[],
  sizes        jsonb,
  created_at   timestamptz not null default now()
);

-- Gallery (poze locație/ambient)
create table if not exists public.gallery (
  id         uuid primary key default gen_random_uuid(),
  url        text not null,
  caption    text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Reservations (masă — dezactivate din config, structura există pentru viitor)
create table if not exists public.reservations (
  id             uuid primary key default gen_random_uuid(),
  item_id        uuid references public.items(id) on delete set null,
  customer_name  text not null,
  customer_phone text not null,
  customer_email text,
  start_date     timestamptz not null,
  end_date       timestamptz,
  guests         integer,
  total_price    numeric(10, 2),
  status         text not null default 'pending'
                   check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  notes          text,
  created_at     timestamptz not null default now()
);

-- Contact requests
create table if not exists public.contact_requests (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  phone      text not null,
  email      text,
  message    text not null,
  resolved   boolean not null default false,
  created_at timestamptz not null default now()
);

-- Site settings
create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================

create index if not exists items_category_idx       on public.items(category_id);
create index if not exists items_available_idx      on public.items(available);
create index if not exists items_popular_idx        on public.items(is_popular);
create index if not exists menu_categories_sort_idx on public.menu_categories(sort_order);
create index if not exists gallery_sort_idx         on public.gallery(sort_order);
create index if not exists reservations_status_idx  on public.reservations(status);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.menu_categories   enable row level security;
alter table public.items             enable row level security;
alter table public.gallery           enable row level security;
alter table public.reservations      enable row level security;
alter table public.contact_requests  enable row level security;
alter table public.site_settings     enable row level security;

create policy "menu_categories_public_read" on public.menu_categories
  for select using (visible = true);

create policy "items_public_read" on public.items
  for select using (true);

create policy "gallery_public_read" on public.gallery
  for select using (true);

create policy "contact_requests_public_insert" on public.contact_requests
  for insert with check (true);

create policy "site_settings_public_read" on public.site_settings
  for select using (true);

-- ============================================================
-- Default site settings
-- ============================================================

insert into public.site_settings (key, value) values
  ('hero_title',    '"Brew & Bean — Cafea de specialitate în inima Bistriței"'),
  ('hero_subtitle', '"Din boabe selectate manual, prăjite local, preparate cu pasiune."'),
  ('benefits',      '["Specialty coffee", "Prăjitorie locală", "Lapte vegetal disponibil", "Terasă în centru"]'),
  ('maps_embed',    'null')
on conflict (key) do nothing;

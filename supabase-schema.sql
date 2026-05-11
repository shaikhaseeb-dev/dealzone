-- ============================================================
-- DealZone — Supabase Database Schema v2
-- Run in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

create extension if not exists "uuid-ossp";

-- ── Categories ────────────────────────────────────────────
create table if not exists categories (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  slug       text not null unique,
  icon       text default '📦',
  count      int  default 0,
  created_at timestamptz default now()
);

insert into categories (name, slug, icon) values
  ('Electronics', 'electronics', '⚡'),
  ('Fashion',     'fashion',     '👗'),
  ('Kitchen',     'kitchen',     '🍳'),
  ('Fitness',     'fitness',     '💪'),
  ('Beauty',      'beauty',      '✨'),
  ('Books',       'books',       '📚'),
  ('Gaming',      'gaming',      '🎮'),
  ('Home',        'home',        '🏠')
on conflict (slug) do nothing;

-- ── Products ──────────────────────────────────────────────
-- affiliate_links is a JSONB array:
-- [{ platform, price, url, label, inStock }, ...]
-- price is stored per-platform. best_price is computed/cached.
create table if not exists products (
  id               uuid primary key default uuid_generate_v4(),
  slug             text not null unique,
  title            text not null,
  short_title      text,
  -- best_price = lowest in-stock platform price (auto-computed via trigger)
  best_price       numeric(10,2) default 0,
  original_price   numeric(10,2),
  discount         int  default 0,
  rating           numeric(3,1) default 4.0,
  reviews          int  default 0,
  category         text not null references categories(slug),
  tags             text[] default '{}',
  featured         bool default false,
  is_trending      bool default false,
  is_new           bool default false,
  active           bool default true,
  in_stock         bool default true,
  images           text[] default '{}',
  description      text,
  features         text[] default '{}',
  -- Per-platform affiliate links with individual prices:
  -- [{ "platform":"Amazon","price":1299,"url":"...","label":"Buy on Amazon","inStock":true }, ...]
  affiliate_links  jsonb default '[]',
  video_url        text,
  delivery         text default 'Free delivery in 2-3 days',
  warranty         text default '1 Year Warranty',
  clicks           int  default 0,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- Auto-update updated_at timestamp
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_updated_at on products;
create trigger set_updated_at
  before update on products
  for each row execute function update_updated_at();

-- Auto-compute best_price from affiliate_links
create or replace function compute_best_price()
returns trigger as $$
declare
  min_price numeric := null;
  link      jsonb;
begin
  for link in select * from jsonb_array_elements(new.affiliate_links)
  loop
    if (link->>'inStock')::boolean is not false then
      if min_price is null or (link->>'price')::numeric < min_price then
        min_price := (link->>'price')::numeric;
      end if;
    end if;
  end loop;
  new.best_price := coalesce(min_price, 0);
  -- Auto-compute discount from best_price vs original_price
  if new.original_price > 0 and new.best_price > 0 then
    new.discount := round(((new.original_price - new.best_price) / new.original_price) * 100);
  end if;
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_best_price on products;
create trigger set_best_price
  before insert or update of affiliate_links, original_price on products
  for each row execute function compute_best_price();

-- ── Click Tracking ────────────────────────────────────────
create table if not exists clicks (
  id         uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id) on delete cascade,
  platform   text default 'unknown',
  ip         text,
  user_agent text,
  referrer   text,
  clicked_at timestamptz default now()
);

create index if not exists idx_clicks_product_id on clicks(product_id);
create index if not exists idx_clicks_clicked_at on clicks(clicked_at);
create index if not exists idx_clicks_platform   on clicks(platform);

-- Increment click counter (called from /api/track-click)
create or replace function increment_click_count(pid uuid)
returns void as $$
begin
  update products set clicks = clicks + 1 where id = pid;
end;
$$ language plpgsql security definer;

-- ── Row Level Security ────────────────────────────────────
alter table products   enable row level security;
alter table clicks     enable row level security;
alter table categories enable row level security;

-- Public: read active products & categories
create policy "public_read_products"    on products    for select using (active = true);
create policy "public_read_categories"  on categories  for select using (true);
-- Public: insert clicks (tracking)
create policy "public_insert_clicks"    on clicks      for insert with check (true);
-- Service role key bypasses RLS (for admin writes)

-- ── Useful views ──────────────────────────────────────────
create or replace view daily_clicks as
  select date_trunc('day', clicked_at) as day, count(*) as click_count
  from clicks group by 1 order by 1;

create or replace view platform_click_breakdown as
  select platform, count(*) as click_count
  from clicks group by 1 order by 2 desc;

create or replace view top_products_by_clicks as
  select id, slug, short_title, title, best_price, images[1] as thumbnail, clicks, discount
  from products where active = true order by clicks desc limit 10;

-- ── Example INSERT (run after creating schema) ────────────
-- insert into products (slug, title, short_title, original_price, category, images, description, features, affiliate_links) values (
--   'boat-rockerz-450',
--   'boAt Rockerz 450 Wireless Headphones',
--   'boAt Rockerz 450',
--   3990,
--   'electronics',
--   ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'],
--   'Premium wireless headphones with 15 hours playtime.',
--   ARRAY['15 Hours Playback', '40mm Dynamic Drivers', 'Foldable Design'],
--   '[
--     {"platform":"Amazon",  "price":1299,"url":"https://amzn.to/xxx","label":"Buy on Amazon",  "inStock":true},
--     {"platform":"Flipkart","price":1349,"url":"https://fkrt.to/xxx","label":"Buy on Flipkart","inStock":true}
--   ]'::jsonb
-- );

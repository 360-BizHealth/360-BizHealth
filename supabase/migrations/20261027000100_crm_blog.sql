-- 360 Biz Health: structured retreat enquiries + database-backed blog CMS.
-- Additive only: existing leads, notes, audit history and admin users are untouched.

-- ---------------------------------------------------------------------------
-- Leads: structured details captured by service-specific forms
-- ---------------------------------------------------------------------------
alter table public.leads
  add column if not exists retreat_package text
    check (retreat_package is null or retreat_package in ('team-recharge', 'corporate-offsite', 'leadership-retreat', 'custom')),
  add column if not exists details jsonb not null default '{}'::jsonb;

comment on column public.leads.retreat_package is 'Corporate retreat package chosen on the retreats page (null when not applicable or not chosen).';
comment on column public.leads.details is 'Structured form answers beyond the core columns, e.g. {participants, duration, retreatType, destination, travelDates} for retreat enquiries.';

create index if not exists leads_retreat_package_idx on public.leads (retreat_package, created_at desc) where retreat_package is not null;

-- ---------------------------------------------------------------------------
-- Blog media: uploaded images stored in the database so they persist on
-- serverless hosting without separate object storage. Served same-origin by
-- GET /api/v1/media/:id (keeps the site's img-src 'self' CSP intact).
-- ---------------------------------------------------------------------------
create table if not exists public.blog_media (
  id           uuid primary key default gen_random_uuid(),
  mime_type    text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  byte_size    integer not null check (byte_size > 0 and byte_size <= 2097152),
  data         bytea not null,
  sha256       text not null,
  original_name text check (original_name is null or char_length(original_name) <= 200),
  created_by   uuid,
  created_by_email text,
  created_at   timestamptz not null default now()
);
create index if not exists blog_media_created_idx on public.blog_media (created_at desc);
create index if not exists blog_media_sha_idx on public.blog_media (sha256);

-- ---------------------------------------------------------------------------
-- Blog posts. content_md is what editors write; content_html is the sanitised
-- HTML rendered by the server at save time and served to visitors.
-- ---------------------------------------------------------------------------
create table if not exists public.blog_posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 120),
  title            text not null check (char_length(title) between 5 and 160),
  excerpt          text not null check (char_length(excerpt) between 20 and 300),
  content_md       text not null check (char_length(content_md) <= 100000),
  content_html     text not null,
  headings         jsonb not null default '[]'::jsonb,
  key_points       jsonb not null default '[]'::jsonb,
  faqs             jsonb not null default '[]'::jsonb,
  category         text not null check (char_length(category) between 2 and 60),
  author           text not null check (char_length(author) between 2 and 100),
  status           text not null default 'draft' check (status in ('draft', 'published')),
  published_at     timestamptz,
  image_url        text check (image_url is null or char_length(image_url) <= 300),
  image_alt        text check (image_alt is null or char_length(image_alt) <= 200),
  seo_title        text check (seo_title is null or char_length(seo_title) <= 70),
  seo_description  text check (seo_description is null or char_length(seo_description) <= 170),
  read_minutes     integer not null default 1 check (read_minutes between 1 and 120),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  created_by_email text,
  updated_by_email text,
  constraint blog_posts_published_has_date check (status = 'draft' or published_at is not null)
);
create index if not exists blog_posts_public_idx on public.blog_posts (published_at desc) where status = 'published';
create index if not exists blog_posts_updated_idx on public.blog_posts (updated_at desc);
create index if not exists blog_posts_category_idx on public.blog_posts (category);

drop trigger if exists blog_posts_touch_updated_at on public.blog_posts;
create trigger blog_posts_touch_updated_at before update on public.blog_posts
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Same access model as the lead tables: API role only, nothing for anon/authenticated
-- ---------------------------------------------------------------------------
alter table public.blog_posts enable row level security;
alter table public.blog_media enable row level security;
drop policy if exists bh_api_all on public.blog_posts;
drop policy if exists bh_api_all on public.blog_media;
create policy bh_api_all on public.blog_posts for all to bh_api using (true) with check (true);
create policy bh_api_all on public.blog_media for all to bh_api using (true) with check (true);
grant select, insert, update, delete on public.blog_posts, public.blog_media to bh_api;

do $$
declare r text;
begin
  foreach r in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format('revoke all on public.blog_posts, public.blog_media from %I', r);
    end if;
  end loop;
end;
$$;

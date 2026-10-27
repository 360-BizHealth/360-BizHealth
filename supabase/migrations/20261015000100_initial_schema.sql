-- 360 Biz Health: lead capture and admin schema
-- Target: Supabase PostgreSQL 15+ (works on any PostgreSQL 15+ with an `auth.users` table).
--
-- Access model
--   * The browser never talks to the database. All reads and writes go through the
--     Vercel API functions, which connect with the server-only DATABASE_URL.
--   * Row Level Security is enabled on every table and NO policies are granted to the
--     `anon` or `authenticated` roles, so the Supabase Data API (PostgREST) cannot read
--     or write these tables even with the public anon key or a signed-in user's JWT.
--   * Administrators sign in through Supabase Auth; the API then checks `admin_users`
--     for an active row before allowing any lead access.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- Administrators (authorisation list; authentication is Supabase Auth)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  email       text not null,
  role        text not null default 'staff' check (role in ('admin', 'staff')),
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
comment on table public.admin_users is
  'People allowed into the lead dashboard. admin = full access incl. CSV export and notification retry; staff = view and update leads.';

-- ---------------------------------------------------------------------------
-- Leads
-- ---------------------------------------------------------------------------
create table if not exists public.leads (
  id                     uuid primary key default gen_random_uuid(),
  reference              text not null unique,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  -- submitted by the visitor
  name                   text not null check (char_length(name) between 2 and 100),
  email                  text not null check (char_length(email) between 6 and 254),
  phone                  text not null check (char_length(phone) between 8 and 20),
  company                text not null check (char_length(company) between 2 and 150),
  service                text not null check (char_length(service) between 1 and 60),
  company_size           text check (company_size is null or company_size in ('1-10', '11-50', '51-200', '201-500', '500+')),
  city                   text check (city is null or char_length(city) <= 100),
  current_hrms           text check (current_hrms is null or char_length(current_hrms) <= 120),
  message                text not null check (char_length(message) between 15 and 4000),
  consent                boolean not null check (consent),
  consent_version        text not null,
  consent_at             timestamptz not null default now(),

  -- where it came from
  source_page            text check (source_page is null or char_length(source_page) <= 300),
  source_vertical        text check (source_vertical is null or char_length(source_vertical) <= 80),
  referrer               text check (referrer is null or char_length(referrer) <= 500),
  landing_page           text check (landing_page is null or char_length(landing_page) <= 500),
  utm                    jsonb not null default '{}'::jsonb,

  -- abuse prevention (salted hash only; the raw IP is never stored)
  ip_hash                text,
  user_agent             text check (user_agent is null or char_length(user_agent) <= 300),
  idempotency_key        uuid unique,
  content_hash           text not null,

  -- private follow-up, managed by staff
  status                 text not null default 'new'
                           check (status in ('new', 'contacted', 'qualified', 'proposal', 'converted', 'lost', 'on_hold')),
  assigned_to            text check (assigned_to is null or char_length(assigned_to) <= 120),
  next_follow_up         date,
  last_contacted_at      timestamptz,

  -- business notification e-mail
  notification_status    text not null default 'pending'
                           check (notification_status in ('pending', 'sent', 'failed', 'not_configured')),
  notification_attempts  integer not null default 0,
  notification_error     text,
  notified_at            timestamptz
);

create index if not exists leads_created_at_idx      on public.leads (created_at desc);
create index if not exists leads_status_idx          on public.leads (status, created_at desc);
create index if not exists leads_service_idx         on public.leads (service, created_at desc);
create index if not exists leads_email_idx           on public.leads (lower(email));
create index if not exists leads_content_hash_idx    on public.leads (content_hash, created_at desc);
create index if not exists leads_notification_idx    on public.leads (notification_status) where notification_status in ('pending', 'failed');

-- ---------------------------------------------------------------------------
-- Private follow-up notes
-- ---------------------------------------------------------------------------
create table if not exists public.lead_notes (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid not null references public.leads (id) on delete cascade,
  author_id     uuid,
  author_email  text not null,
  body          text not null check (char_length(body) between 1 and 4000),
  created_at    timestamptz not null default now()
);
create index if not exists lead_notes_lead_idx on public.lead_notes (lead_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Audit log: lead changes, notification attempts, exports, sign-ins
-- ---------------------------------------------------------------------------
create table if not exists public.audit_log (
  id           bigint generated always as identity primary key,
  lead_id      uuid references public.leads (id) on delete cascade,
  actor_id     uuid,
  actor_email  text,
  action       text not null check (char_length(action) <= 60),
  details      jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists audit_log_lead_idx on public.audit_log (lead_id, created_at desc);
create index if not exists audit_log_created_idx on public.audit_log (created_at desc);

-- ---------------------------------------------------------------------------
-- Fixed-window rate limiting shared by all serverless instances
-- ---------------------------------------------------------------------------
create table if not exists public.rate_limits (
  key           text not null,
  window_start  timestamptz not null,
  hits          integer not null default 0,
  primary key (key, window_start)
);
create index if not exists rate_limits_window_idx on public.rate_limits (window_start);

-- Records one hit and returns true when the caller is still within the limit.
create or replace function public.rate_limit_hit(p_key text, p_window_seconds integer, p_max integer)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_window timestamptz := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);
  v_hits integer;
begin
  insert into public.rate_limits as r (key, window_start, hits)
  values (p_key, v_window, 1)
  on conflict (key, window_start) do update set hits = r.hits + 1
  returning hits into v_hits;

  -- opportunistic clean-up of expired windows (cheap, indexed)
  if random() < 0.02 then
    delete from public.rate_limits where window_start < now() - interval '1 day';
  end if;

  return v_hits <= p_max;
end;
$$;

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists leads_touch_updated_at on public.leads;
create trigger leads_touch_updated_at before update on public.leads
  for each row execute function public.touch_updated_at();

drop trigger if exists admin_users_touch_updated_at on public.admin_users;
create trigger admin_users_touch_updated_at before update on public.admin_users
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security: deny-by-default for the Data API roles
-- ---------------------------------------------------------------------------
alter table public.admin_users enable row level security;
alter table public.leads       enable row level security;
alter table public.lead_notes  enable row level security;
alter table public.audit_log   enable row level security;
alter table public.rate_limits enable row level security;

-- The API connects as the table owner (`postgres` on Supabase), which is not subject
-- to RLS unless FORCE is set. For a least-privilege setup, create a login role that
-- is a member of `bh_api` and use it in DATABASE_URL instead (see README); the
-- policies below grant that role exactly the access the API needs.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'bh_api') then
    create role bh_api nologin;
  end if;
end;
$$;

drop policy if exists bh_api_all on public.admin_users;
drop policy if exists bh_api_all on public.leads;
drop policy if exists bh_api_all on public.lead_notes;
drop policy if exists bh_api_all on public.audit_log;
drop policy if exists bh_api_all on public.rate_limits;
create policy bh_api_all on public.admin_users for all to bh_api using (true) with check (true);
create policy bh_api_all on public.leads       for all to bh_api using (true) with check (true);
create policy bh_api_all on public.lead_notes  for all to bh_api using (true) with check (true);
create policy bh_api_all on public.audit_log   for all to bh_api using (true) with check (true);
create policy bh_api_all on public.rate_limits for all to bh_api using (true) with check (true);

grant usage on schema public to bh_api;
grant select, insert, update, delete on public.admin_users, public.leads, public.lead_notes, public.rate_limits to bh_api;
grant select, insert on public.audit_log to bh_api;
grant usage on all sequences in schema public to bh_api;
grant execute on function public.rate_limit_hit(text, integer, integer) to bh_api;

-- Remove every privilege the Supabase Data API roles might otherwise inherit.
do $$
declare r text;
begin
  foreach r in array array['anon', 'authenticated'] loop
    if exists (select 1 from pg_roles where rolname = r) then
      execute format('revoke all on public.admin_users, public.leads, public.lead_notes, public.audit_log, public.rate_limits from %I', r);
      execute format('revoke all on function public.rate_limit_hit(text, integer, integer) from %I', r);
    end if;
  end loop;
end;
$$;
revoke all on function public.rate_limit_hit(text, integer, integer) from public;

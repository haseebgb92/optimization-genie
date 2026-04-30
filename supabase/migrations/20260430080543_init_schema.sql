create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists sites (
  id uuid primary key default gen_random_uuid(),
  install_id text not null unique,
  domain text not null,
  site_url text not null,
  client_name text not null,
  secret_hash text not null,
  wp_version text not null,
  php_version text not null,
  plugin_version text not null,
  license_status text not null default 'active',
  health_status text not null default 'healthy',
  last_heartbeat timestamptz,
  pagespeed_mobile int,
  pagespeed_desktop int,
  broken_links_count int not null default 0,
  errors_404_count int not null default 0,
  webp_status text not null default 'unknown',
  last_maintenance_run timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists site_heartbeats (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists site_pagespeed_reports (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  mobile_score int not null,
  desktop_score int not null,
  lcp numeric not null,
  cls numeric not null,
  inp numeric not null,
  created_at timestamptz not null default now()
);

create table if not exists site_actions (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  action text not null,
  actor text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists site_activity_logs (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references sites(id) on delete cascade,
  event text not null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists site_licenses (
  site_id uuid primary key references sites(id) on delete cascade,
  status text not null default 'active',
  updated_at timestamptz not null default now()
);


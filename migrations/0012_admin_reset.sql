create table if not exists admin_reset (
  token_hash text primary key,
  exp        timestamptz not null,
  used_at    timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists admin_reset_exp_idx on admin_reset (exp);

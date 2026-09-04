create table if not exists desk_secrets (
  id           text primary key,
  hmac_pepper  text not null,
  created_at   timestamptz not null default now()
);

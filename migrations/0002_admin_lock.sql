create table if not exists admin_lock (
  id         text primary key,
  cred_hash  text not null,
  updated_at timestamptz not null default now()
);

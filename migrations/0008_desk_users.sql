create table if not exists desk_users (
  id         text primary key,
  username   text not null unique,
  pass_hash  text not null,
  created_at timestamptz not null default now()
);

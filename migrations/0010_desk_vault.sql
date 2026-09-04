create table if not exists desk_vault (
  id          text primary key,
  ciphertext  text not null,
  iv          text not null,
  tag         text not null,
  updated_at  timestamptz not null default now()
);

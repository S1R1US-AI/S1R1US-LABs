create table if not exists admin_2fa (
  id          text primary key,
  user_id     text not null,
  enrolled_at timestamptz not null default now()
);

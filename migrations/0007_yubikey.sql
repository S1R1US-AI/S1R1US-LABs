create table if not exists admin_yubi (
  id          text primary key,
  public_id   text not null,
  last_otp    text,
  enrolled_at timestamptz not null default now()
);

-- Optional admin-panel YubiKey lock + FIDO2/WebAuthn credentials (Yubico 2026).
create table if not exists admin_yubi_gate (
  id          text primary key,
  panel_lock  boolean not null default false,
  updated_at  timestamptz not null default now()
);
insert into admin_yubi_gate (id, panel_lock)
values ('gate', false)
on conflict (id) do nothing;

create table if not exists admin_webauthn (
  id             text primary key,
  credential_id  text not null unique,
  public_key     text not null,
  alg            integer not null,
  sign_count     integer not null default 0,
  transports     text not null default '',
  enrolled_at    timestamptz not null default now()
);

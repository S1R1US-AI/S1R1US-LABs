alter table admin_2fa add column if not exists passwordless boolean not null default false;
alter table admin_2fa add column if not exists handle text;

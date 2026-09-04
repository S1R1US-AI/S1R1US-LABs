alter table admin_lock add column if not exists token_gen integer not null default 1;

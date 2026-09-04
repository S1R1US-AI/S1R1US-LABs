create unique index if not exists admin_yubi_public_id on admin_yubi (public_id);
update admin_yubi set id = '1' where id = 'default';

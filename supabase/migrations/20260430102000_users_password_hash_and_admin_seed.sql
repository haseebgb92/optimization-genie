alter table if exists users
add column if not exists password_hash text;

update users
set password_hash = coalesce(password_hash, '')
where password_hash is null;

alter table if exists users
alter column password_hash set default '';

alter table if exists users
alter column password_hash set not null;

insert into users (email, password_hash, role)
values ('haseeb.dlp@gmail.com', '71f896b0f024dddb17d39eae2fb47270ab179b9bd294906f18041df3c4ccf539', 'admin')
on conflict (email)
do update set
  password_hash = excluded.password_hash,
  role = 'admin';

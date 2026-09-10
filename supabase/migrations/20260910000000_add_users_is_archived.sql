alter table public."Users"
    add column is_archived boolean not null default false;

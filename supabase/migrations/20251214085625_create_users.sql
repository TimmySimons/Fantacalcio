create table public."Users" (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    name text not null,
    auth_user_id uuid null,
    team_name text not null,
    roles text[] not null default '{DEFAULT}'::text[],
    constraint Users_pkey primary key (id),
    constraint Users_auth_user_id_fkey foreign KEY (auth_user_id) references auth.users (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

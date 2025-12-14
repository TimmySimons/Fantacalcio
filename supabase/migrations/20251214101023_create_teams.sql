create table public."Teams" (
        created_at timestamp with time zone not null default now(),
        user_id uuid not null default gen_random_uuid (),
        gameweek_id uuid not null,
        id uuid not null default gen_random_uuid (),
        user_gameweek_id text not null,
        constraint Teams_pkey primary key (id),
        constraint Teams_id_key unique (id),
        constraint Teams_user_gameweek_id_key unique (user_gameweek_id),
        constraint Teams_gameweek_id_fkey foreign KEY (gameweek_id) references "Gameweeks" (id) on update CASCADE on delete CASCADE,
        constraint Teams_user_id_fkey foreign KEY (user_id) references "Users" (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

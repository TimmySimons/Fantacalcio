create table public."Gameweeks" (
            id uuid not null default gen_random_uuid (),
            created_at timestamp with time zone not null default now(),
            week text not null,
            start_date timestamp with time zone not null,
            end_date timestamp with time zone not null,
            year bigint not null,
            sorare_slug text null,
            scores_fetched_date timestamp with time zone null,
            scores_published_date timestamp with time zone null,
            constraint Gameweeks_pkey primary key (id),
            constraint Gameweeks_sorare_slug_key unique (sorare_slug)
) TABLESPACE pg_default;

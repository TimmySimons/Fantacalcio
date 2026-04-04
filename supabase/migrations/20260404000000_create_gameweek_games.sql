create table public."GameweekGames" (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    gameweek_id uuid not null,
    date timestamp with time zone not null,
    home_team_name text not null,
    home_team_code text not null,
    home_team_picture_url text null,
    away_team_name text not null,
    away_team_code text not null,
    away_team_picture_url text null,
    status_typed text not null,
    home_score integer null,
    away_score integer null,
    constraint GameweekGames_pkey primary key (id),
    constraint GameweekGames_game_unique unique (gameweek_id, date, home_team_code, away_team_code),
    constraint GameweekGames_gameweek_id_fkey foreign key (gameweek_id) references "Gameweeks" (id) on update cascade on delete cascade
) tablespace pg_default;

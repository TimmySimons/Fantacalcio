create table public."PlayersAwayTeams" (
   id uuid not null default gen_random_uuid (),
   created_at timestamp with time zone not null default now(),
   player_id uuid not null,
   gameweek_id uuid not null,
   away_team text null,
   constraint PlayersAwayTeams_pkey primary key (id),
   constraint playersawayteams_player_gameweek_unique unique (player_id, gameweek_id),
   constraint PlayersAwayTeams_gameweek_id_fkey foreign KEY (gameweek_id) references "Gameweeks" (id) on update CASCADE on delete CASCADE,
   constraint PlayersAwayTeams_player_id_fkey foreign KEY (player_id) references "Players" (id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

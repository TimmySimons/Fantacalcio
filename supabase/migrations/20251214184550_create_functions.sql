-- bulk_update_teamplayer_scores
DROP FUNCTION IF EXISTS public.bulk_update_teamplayer_scores(updates jsonb);

CREATE OR REPLACE FUNCTION public.bulk_update_teamplayer_scores(updates jsonb)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE "TeamPlayers" tp
    SET score = (u->>'score')::numeric
    FROM jsonb_array_elements(updates) AS u
    WHERE tp.id = (u->>'id')::int
      AND tp.is_score_override IS NOT TRUE;
END;
$$;


-- get_user_gameweek_scores
DROP FUNCTION IF EXISTS public.get_user_gameweek_scores(gameweek_id_input uuid);

CREATE OR REPLACE FUNCTION public.get_user_gameweek_scores(gameweek_id_input uuid)
RETURNS TABLE(
    user_id uuid,
    total_score numeric
)
LANGUAGE sql
AS $$
    SELECT
        t.user_id,
        CASE
            WHEN g.scores_published_date IS NOT NULL
                THEN COALESCE(SUM(tp.score), 0)
            ELSE 0
            END AS total_score
    FROM "Teams" t
             JOIN "TeamPlayers" tp ON tp.team_id = t.id
             JOIN "Gameweeks" g ON g.id = t.gameweek_id
    WHERE t.gameweek_id = gameweek_id_input
    GROUP BY t.user_id, g.scores_published_date;
$$;


-- sync_user_players
DROP FUNCTION IF EXISTS public.sync_user_players(p_user_id uuid, p_player_ids uuid[]);

CREATE OR REPLACE FUNCTION public.sync_user_players(
    p_user_id uuid,
    p_player_ids uuid[]
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    -- Delete user players not in new selection
    DELETE FROM "UserPlayers"
    WHERE user_id = p_user_id
      AND NOT (player_id = ANY(p_player_ids));

    -- Insert missing user players
    INSERT INTO "UserPlayers"(user_id, player_id)
    SELECT p_user_id, unnest(p_player_ids)
        ON CONFLICT (user_id, player_id) DO NOTHING;
END;
$$;


-- bulk_update_players_away_team
DROP FUNCTION IF EXISTS public.bulk_update_players_away_team(p_gameweek_id uuid, updates jsonb);

CREATE OR REPLACE FUNCTION public.bulk_update_players_away_team(
    p_gameweek_id uuid,
    updates jsonb
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO "PlayersAwayTeams" (player_id, gameweek_id, away_team)
    SELECT
        p.id,
        p_gameweek_id,
        u->>'away_team'
    FROM jsonb_array_elements(updates) AS u
    INNER JOIN "Players" p ON p.sorare_slug = u->>'sorare_slug'
    ON CONFLICT ON CONSTRAINT playersawayteams_player_gameweek_unique
    DO UPDATE SET away_team = EXCLUDED.away_team;
END;
$$;

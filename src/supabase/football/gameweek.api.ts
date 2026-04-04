import { supabase } from '../supabase.ts';
import type { GameweekContract } from '../../model/gameweek.contract.ts';
import type { GetGameweekGamesResponse } from '../../sorare/contracts/gameweek-games.contract.ts';

type GameweekGame = GetGameweekGamesResponse['so5']['so5Fixture']['games'][number];

export class GameweekApi {
    public static async getAllGameweeks(): Promise<GameweekContract[]> {
        const { data, error } = await supabase
            .from('Gameweeks')
            .select('*')
            .order('start_date', { ascending: true });

        if (error) throw error;
        return data.map((d) => ({
            ...d,
            start_date: new Date(d.start_date),
            end_date: new Date(d.end_date),
            week: +d.week
        }));
    }

    public static async getGameweek(id: string): Promise<GameweekContract> {
        const { data, error } = await supabase.from('Gameweeks').select('*').eq('id', id).single();

        if (error) throw error;
        return data;
    }

    public static async deleteGameweek(id: string): Promise<void> {
        const { error } = await supabase.from('Gameweeks').delete().eq('id', id);

        if (error) throw error;
    }

    public static async updateGameweekScoredDate(gameweekId: string) {
        const { error } = await supabase
            .from('Gameweeks')
            .update({ scores_fetched_date: new Date().toISOString() })
            .eq('id', gameweekId);

        if (error) throw error;
    }

    public static async updateGameweekScorePublishedDate(gameweekId: string) {
        const { error } = await supabase
            .from('Gameweeks')
            .update({ scores_published_date: new Date().toISOString() })
            .eq('id', gameweekId);

        if (error) throw error;
    }

    public static async getGameweekGames(gameweekId: string) {
        const { data, error } = await supabase
            .from('GameweekGames')
            .select('*')
            .eq('gameweek_id', gameweekId);

        if (error) throw error;
        return data;
    }

    public static async saveGameweekGames(gameweekId: string, games: GameweekGame[]) {
        const rows = games.map((g) => ({
            gameweek_id: gameweekId,
            date: g.date,
            home_team_name: g.homeTeam.shortName,
            home_team_code: g.homeTeam.code,
            home_team_picture_url: g.homeTeam.pictureUrl,
            away_team_name: g.awayTeam.shortName,
            away_team_code: g.awayTeam.code,
            away_team_picture_url: g.awayTeam.pictureUrl,
            status_typed: g.statusTyped,
            home_score: g.homeScore,
            away_score: g.awayScore,
            updated_at: new Date().toISOString()
        }));

        const { error } = await supabase
            .from('GameweekGames')
            .upsert(rows, { onConflict: 'gameweek_id,date,home_team_code,away_team_code' });

        if (error) throw error;
    }

    public static async getUsersGameweekScores(gameweekId: string): Promise<
        {
            user_id: string;
            total_score: number;
        }[]
    > {
        const { data, error } = await supabase.rpc('get_user_gameweek_scores', {
            gameweek_id_input: gameweekId
        });

        if (error) throw error;

        return data;
    }
}

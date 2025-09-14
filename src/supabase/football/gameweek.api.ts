import { supabase } from '../supabase.ts';
import type { GameweekContract } from '../../model/gameweek.contract.ts';

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
}

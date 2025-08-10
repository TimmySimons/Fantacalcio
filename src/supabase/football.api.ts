import { supabase } from './supabase.ts';

export class FootballApi {
    public static async getPlayers() {
        const { data, error } = await supabase
            .from('Players')
            .select('*')
            .order('name', { ascending: true });

        if (error) throw error;
        return data;
    }
}

import { supabase } from './supabase.ts';
import type { GameweekContract } from '../model/gameweek.contract.ts';
import type { TeamContract } from '../model/team.contract.ts';
import type { PlayerContract, UpdatePlayerContract } from '../model/player.contract.ts';
import type { AppUserContract } from '../model/app-user.contract.ts';

export class FootballApi {
    public static async getPlayers() {
        const { data, error } = await supabase
            .from('Players')
            .select('*')
            .order('last_name', { ascending: true });

        if (error) throw error;
        return data;
    }

    public static async getPlayer(id: string): Promise<PlayerContract> {
        const { data, error } = await supabase
            .from('Players')
            .select('*')
            .eq('id', id)
            .limit(1)
            .single();

        if (error) throw error;
        return data;
    }

    public static async updatePlayer(playerId: string, data: UpdatePlayerContract): Promise<void> {
        const { error } = await supabase.from('Players').update(data).eq('id', playerId);

        if (error) {
            throw new Error(`Failed to update player: ${error.message}`);
        }
    }

    public static async getUserPlayers(appUserId: string): Promise<PlayerContract[]> {
        const { data, error } = await supabase
            .from('UserPlayers')
            .select('*, player:Players(*)')
            .eq('user_id', appUserId);

        if (error) throw error;
        if (!data) return [];

        const userPlayers = data?.map((up: any) => up.player);

        return userPlayers ?? [];
    }

    public static async updateUserPlayers(appUserId: string, playerIds: string[]): Promise<void> {
        const { error } = await supabase.rpc('sync_user_players', {
            p_user_id: appUserId,
            p_player_ids: playerIds
        });

        if (error) throw error;
    }

    public static async getGameweek(id: string): Promise<GameweekContract> {
        const { data, error } = await supabase.from('Gameweeks').select('*').eq('id', id).single();

        if (error) throw error;
        return data;
    }

    // The one to manage
    public static async getUpcomingGameweek(): Promise<GameweekContract> {
        const today = new Date().toISOString();

        const { data, error } = await supabase
            .from('Gameweeks')
            .select('*')
            .gt('start_date', today)
            .order('start_date', { ascending: true })
            .limit(1)
            .single();

        if (error) throw error;
        return data;
    }

    // The one to score
    public static async getCurrentGameweek(): Promise<GameweekContract> {
        const today = new Date().toISOString();

        const { data, error } = await supabase
            .from('Gameweeks')
            .select('*')
            .lte('start_date', today)
            .gte('end_date', today)
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    public static async getGameweekTeam(
        gwId: string,
        appUserId: string
    ): Promise<TeamContract | undefined> {
        const { data, error } = await supabase
            .from('Teams')
            .select('*, team_players:TeamPlayers(*, player:Players(*))')
            .eq('gameweek_id', gwId)
            .eq('user_id', appUserId)
            .maybeSingle();

        if (error) throw error;

        if (!data) return;

        const teamPlayers = data?.team_players.map((up: any) => ({
            ...up.player,
            score: up.score
        }));
        return { ...data, team_players: teamPlayers };
    }

    public static async createGameweekTeam(
        gameweekId: string,
        userId: string
    ): Promise<TeamContract | undefined> {
        console.log('Creating gameweek_team...');
        const { data, error } = await supabase.from('Teams').upsert(
            [
                {
                    user_gameweek_id: `${gameweekId}-${userId}`,
                    gameweek_id: gameweekId,
                    user_id: userId
                }
            ],
            {
                onConflict: 'user_gameweek_id',
                ignoreDuplicates: true
            }
        );

        if (error) {
            console.error('Error creating gameweek_team:', error);
        } else {
            console.log('Created gameweek_team:', data);
            return data ?? undefined;
        }
    }

    public static async addTeamPlayer(teamId: string, playerId: string): Promise<void> {
        console.log('Adding player to team...');
        const { data, error } = await supabase.from('TeamPlayers').upsert(
            [
                {
                    team_player_id: `${teamId}-${playerId}`,
                    team_id: teamId,
                    player_id: playerId
                }
            ],
            {
                onConflict: 'team_player_id',
                ignoreDuplicates: true
            }
        );

        if (error) {
            console.error('Error creating team_player:', error);
        } else {
            console.log('Created team_player:', data);
        }
    }

    public static async removeTeamPlayers(teamId: string, playerIds: string[]): Promise<void> {
        const { data, error } = await supabase
            .from('TeamPlayers')
            .delete()
            .eq('team_id', teamId)
            .in('player_id', playerIds);

        if (error) {
            console.error('Error removing player from team:', error);
        } else {
            console.log('Removed player from team:', data);
        }
    }

    public static async removeAllTeamPlayers(teamId: string): Promise<void> {
        const { data, error } = await supabase.from('TeamPlayers').delete().eq('team_id', teamId);

        if (error) {
            console.error('Error removing all players from team:', error);
        } else {
            console.log('Removed all players from team:', data);
        }
    }

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

    public static async getAllManagers(): Promise<AppUserContract[]> {
        const { data, error } = await supabase.from('Users').select('*, UserPlayers(count)');

        if (error) throw error;

        return data.map((user) => ({
            ...user,
            playerCount: user.UserPlayers[0]?.count ?? 0
        }));
    }

    public static async updatePlayerSorareSlug(
        playerId: string,
        sorareSlug: string
    ): Promise<void> {
        const { error } = await supabase
            .from('Players')
            .update({ sorare_slug: sorareSlug })
            .eq('id', playerId);

        if (error) {
            throw new Error(`Failed to update player slug: ${error.message}`);
        }
    }

    public static async createPlayer(createContract: UpdatePlayerContract): Promise<string> {
        const { data, error } = await supabase
            .from('Players')
            .upsert(createContract, { onConflict: 'id' })
            .select('id')
            .single();

        if (error) {
            throw new Error(`Failed to update player slug: ${error.message}`);
        }

        return data.id;
    }
}

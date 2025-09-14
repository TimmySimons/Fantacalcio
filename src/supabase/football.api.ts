import { supabase } from './supabase.ts';
import type {
    GameweekTeamPlayerContract,
    UserGameweeksTeamPlayersContract
} from '../model/gameweek.contract.ts';
import type { TeamContract } from '../model/team.contract.ts';
import type {
    BasePlayerContract,
    PlayerAverageScoresContract,
    PlayerContract,
    UpdatePlayerContract
} from '../model/player.contract.ts';
import type { AppUserContract } from '../model/app-user.contract.ts';

export class FootballApi {
    public static async getPlayers() {
        const { data, error } = await supabase
            .from('Players')
            .select('*, PlayerSorareAverages(*)')
            .order('last_name', { ascending: true });

        if (error) throw error;

        return data;
    }

    public static async getPlayer(id: string): Promise<PlayerContract> {
        const { data, error } = await supabase
            .from('Players')
            .select('*, PlayerSorareAverages(*)')
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
            .select('*, player:Players(*, PlayerSorareAverages(*))')
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

    public static async getGameweekTeam(
        gwId: string,
        appUserId: string
    ): Promise<TeamContract | undefined> {
        const { data, error } = await supabase
            .from('Teams')
            .select('*, team_players:TeamPlayers(*, player:Players(*, PlayerSorareAverages(*)))')
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

    public static async addTeamPlayers(teamId: string, playerIds: string[]): Promise<void> {
        console.log('Adding players to team...');
        const { data, error } = await supabase.from('TeamPlayers').upsert(
            playerIds.map((playerId) => ({
                team_player_id: `${teamId}-${playerId}`,
                team_id: teamId,
                player_id: playerId
            })),
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
            .upsert(createContract, { onConflict: 'sorare_slug' })
            .select('id')
            .single();

        if (error) {
            throw new Error(`Failed to create player slug: ${error.message}`);
        }

        return data.id;
    }

    public static async getUserGameweeksTeamPlayers(
        userId: string
    ): Promise<GameweekTeamPlayerContract[]> {
        const { data, error } = await supabase
            .from('Teams')
            .select(
                `
                    gameweek_id,
                    user_id,
                    TeamPlayers(id, score),
                    Gameweeks (scores_published_date)
                  `
            )
            .eq('user_id', userId);

        if (error) {
            throw new Error(`Failed to get user gameweek team players: ${error.message}`);
        }

        return data as any as GameweekTeamPlayerContract[];
    }

    public static async getAllUsersGameweeksTeamPlayers(): Promise<
        UserGameweeksTeamPlayersContract[]
    > {
        const { data, error } = await supabase.from('Users').select(
            `
            id,
            Teams (
              gameweek_id,
              user_id,
              TeamPlayers (id, score),
              Gameweeks (scores_published_date)
            )
          `
        );

        if (error) {
            throw new Error(`Failed to get all users gameweek team players: ${error.message}`);
        }

        return data as any as UserGameweeksTeamPlayersContract[];
    }

    public static async createPlayerAverageScores(
        playerId: string,
        scores: PlayerAverageScoresContract
    ): Promise<void> {
        const { error } = await supabase
            .from('PlayerSorareAverages')
            .upsert({ ...scores, player_id: playerId }, { onConflict: 'player_id' });

        if (error) {
            throw new Error(`Failed to create player average scores: ${error.message}`);
        }
    }

    public static async updatePlayerAverageScores(
        playerId: string,
        scores: PlayerAverageScoresContract
    ): Promise<void> {
        const { error } = await supabase
            .from('PlayerSorareAverages')
            .update(scores)
            .eq('player_id', playerId);

        if (error) {
            throw new Error(`Failed to update player average scores: ${error.message}`);
        }
    }

    public static async getAllGameweekPlayers(gameweekId: string): Promise<
        {
            team: { name: string; managerName: string };
            players: { player: BasePlayerContract; teamPlayerId: number; score?: number }[];
        }[]
    > {
        const { data, error } = await supabase
            .from('Teams')
            .select(
                `
                id,
                Users (name, team_name),
                TeamPlayers (
                  id,
                  score,
                  Players (
                    id,
                    first_name,
                    last_name,
                    sorare_slug,
                    club_name_short
                  )
                )
              `
            )
            .eq('gameweek_id', gameweekId);

        if (error) {
            throw new Error(`Failed to get all gameweek players: ${error.message}`);
        }

        return data.map((d) => ({
            team: { name: (d.Users as any).team_name, managerName: (d.Users as any).name },
            players: d.TeamPlayers.map((p) => ({
                player: p.Players as any,
                teamPlayerId: p.id,
                score: p.score
            }))
        }));
    }

    public static async updateGameweekPlayerScores(
        updates: { id: number; score: number }[]
    ): Promise<void> {
        console.log('Updating gameweek player scores...', updates);

        const { error } = await supabase.rpc('bulk_update_teamplayer_scores', {
            updates: updates
        });

        if (error) {
            console.error(error);
        } else {
            console.log('Scores updated!');
        }
    }
}

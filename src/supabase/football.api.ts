import { supabase } from './supabase.ts';
import type {
    createGameweekContract,
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

    public static async getUserPlayers(
        appUserId: string,
        gameweekId?: string
    ): Promise<PlayerContract[]> {
        const selectQuery = gameweekId
            ? '*, player:Players(*, PlayerSorareAverages(*), PlayersAwayTeams(*))'
            : '*, player:Players(*, PlayerSorareAverages(*))';

        let query = supabase.from('UserPlayers').select(selectQuery).eq('user_id', appUserId);

        if (gameweekId) {
            query = query.eq('player.PlayersAwayTeams.gameweek_id', gameweekId);
        }

        const { data, error } = await query;

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
            .select(
                `*,
                team_players:TeamPlayers(
                    *,
                    player:Players(
                        *,
                        PlayerSorareAverages(*),
                        PlayersAwayTeams(*)
                    )
                )`
            )
            .eq('gameweek_id', gwId)
            .eq('user_id', appUserId)
            .eq('team_players.player.PlayersAwayTeams.gameweek_id', gwId)
            .maybeSingle();

        if (error) throw error;

        if (!data) return;

        const teamPlayers = data?.team_players.map((up: any) => {
            return {
                ...up.player,
                score: up.score
            };
        });
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
            .update({ ...scores, updated_at: new Date().toISOString() })
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
                    club_name_short,
                    position
                  )
                )
              `
            )
            .eq('gameweek_id', gameweekId);

        if (error) {
            throw new Error(`Failed to get all gameweek players: ${error.message}`);
        }

        return data
            .filter((d) => (d.Users as any).name !== 'Hanne')
            .map((d) => ({
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

    public static async updateGameweekPlayerScoreOverride(update: {
        id: number;
        score: number | null;
    }): Promise<void> {
        console.log('Overriding gameweek player score...', update);

        const isScoreOverride = update.score !== null;

        const { data, error } = await supabase
            .from('TeamPlayers')
            .update({ score: update.score, is_score_override: isScoreOverride })
            .eq('id', update.id);

        if (error) {
            console.error('Failed to update score_override:', error.message);
        } else {
            console.log('Updated row:', data);
        }
    }

    public static async getPreviousGameweekTeam(
        userId: string,
        previousGameweekId: string
    ): Promise<{ id: string; playerIds: string[] } | undefined> {
        const { data, error } = await supabase
            .from('Teams')
            .select('id, TeamPlayers(player_id)')
            .eq('gameweek_id', previousGameweekId)
            .eq('user_id', userId)
            .maybeSingle();

        if (error) throw error;
        if (!data) return undefined;

        return {
            id: data.id,
            playerIds: data.TeamPlayers.map((tp) => tp.player_id)
        };
    }

    public static async getIncompleteTeamManagers(gameweekId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('Users')
            .select(
                `
                id,
                name,
                Teams!left (
                  id,
                  TeamPlayers (id)
                )
              `
            )
            .eq('Teams.gameweek_id', gameweekId)
            .neq('id', '8115f3d5-7eda-4b26-b707-20b01d449cf9'); // exclude hanne

        if (error) throw error;

        const missing = data
            .filter((user) => {
                const teams = (user.Teams as any[]) || [];
                if (teams.length === 0) return true;
                const teamPlayers = (teams[0]?.TeamPlayers as any[]) || [];
                return teamPlayers.length < 11;
            })
            .map((user) => user.id);

        console.log('Incomplete team managers:', missing.length);
        return missing;
    }

    public static async autoAssignPreviousTeams(
        gameweekId: string,
        previousGameweekId: string
    ): Promise<{ assigned: number; failed: number }> {
        const incompleteUserIds = await this.getIncompleteTeamManagers(gameweekId);

        let assigned = 0;
        let failed = 0;

        for (const userId of incompleteUserIds) {
            try {
                const prevTeam = await this.getPreviousGameweekTeam(userId, previousGameweekId);

                console.log(`Auto-assigning team for user ${userId}...`, prevTeam);

                if (prevTeam && prevTeam.playerIds.length > 0) {
                    await this.createGameweekTeam(gameweekId, userId);
                    const newTeamData = await this.getGameweekTeam(gameweekId, userId);

                    if (newTeamData?.id) {
                        await this.addTeamPlayers(newTeamData.id, prevTeam.playerIds);
                        assigned++;
                    }
                }
            } catch (error) {
                console.error(`Failed to auto-assign team for user ${userId}:`, error);
                failed++;
            }
        }

        return { assigned, failed };
    }

    public static async updatePlayersAwayTeam(
        gameweekId: string,
        updates: { sorare_slug: string; away_team: string }[]
    ): Promise<void> {
        console.log('Updating players away_team...', updates);

        const { error } = await supabase.rpc('bulk_update_players_away_team', {
            p_gameweek_id: gameweekId,
            updates: updates
        });

        if (error) {
            console.error(error);
            throw new Error(`Failed to update away_team: ${error.message}`);
        } else {
            console.log('Away team status updated!');
        }
    }

    public static async createGameweeks(gameweeks: createGameweekContract[]): Promise<void> {
        const { error } = await supabase.from('Gameweeks').upsert(gameweeks, {
            onConflict: 'sorare_slug',
            ignoreDuplicates: true
        });

        if (error) {
            throw new Error(`Failed to create gameweeks: ${error.message}`);
        }
    }
}

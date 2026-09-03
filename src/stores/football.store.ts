import { defineStore } from 'pinia';
import type { GameweekContract } from '../model/gameweek.contract.ts';
import { FootballApi } from '../supabase/football.api.ts';
import type { TeamContract } from '../model/team.contract.ts';
import { useAuthStore } from './auth.store.ts';
import type { PlayerContract } from '../model/player.contract.ts';
import type { AppUserContract } from '../model/app-user.contract.ts';
import { GameweekApi } from '../supabase/football/gameweek.api.ts';
import { SeasonUtil } from '../SeasonUtil.ts';
import { getOrFetchGameweekGames } from '../GameweekGamesUtil.ts';

interface FootballState {
    gameweeks: GameweekContract[] | undefined;
    gameweek: GameweekContract | undefined;
    gameweekTeam: TeamContract | undefined;
    prevGameweekTeam: TeamContract | undefined;
    userPlayers: PlayerContract[] | undefined;
    managers: AppUserContract[] | undefined;
    manager: AppUserContract | undefined;
    playerDetailed: PlayerContract | undefined;
}
export const useFootballStore = defineStore('football-store', {
    state: (): FootballState => ({
        gameweeks: undefined,
        gameweek: undefined,
        gameweekTeam: undefined,
        prevGameweekTeam: undefined,
        userPlayers: undefined,
        managers: undefined,
        manager: undefined,
        playerDetailed: undefined
    }),
    getters: {
        currentGameweek: (state) => {
            if (!state.gameweeks) return undefined;

            const now = new Date();
            const currentSeason = SeasonUtil.getCurrentSeason();
            const seasonGameweeks = state.gameweeks.filter((gw) =>
                SeasonUtil.isInSeason(gw.start_date, currentSeason)
            );

            return (
                seasonGameweeks.find((gw) => gw.start_date <= now && gw.end_date >= now) ??
                [...seasonGameweeks].reverse().find((gw) => gw.end_date < now)
            );
        },
        previousGameweek: (state) => {
            if (!state.gameweeks || !state.gameweek) return undefined;

            const season = SeasonUtil.getSeasonForDate(new Date(state.gameweek.start_date));
            const sorted = state.gameweeks
                .filter((gw) => SeasonUtil.isInSeason(gw.start_date, season))
                .sort((a, b) => +new Date(a.start_date) - +new Date(b.start_date));
            const idx = sorted.findIndex((gw) => gw.id === state.gameweek!.id);

            return idx > 0 ? sorted[idx - 1] : undefined;
        },
        nextGameweek: (state) => {
            if (!state.gameweeks || !state.gameweek) return undefined;

            const season = SeasonUtil.getSeasonForDate(new Date(state.gameweek.start_date));
            const sorted = state.gameweeks
                .filter((gw) => SeasonUtil.isInSeason(gw.start_date, season))
                .sort((a, b) => +new Date(a.start_date) - +new Date(b.start_date));
            const idx = sorted.findIndex((gw) => gw.id === state.gameweek!.id);

            return idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : undefined;
        }
    },
    actions: {
        async getManagers() {
            this.managers = await FootballApi.getAllManagers();
        },
        getManager(id: string) {
            this.manager = this.managers?.find((m) => m.id === id);
        },
        async getAllGameweeks() {
            this.gameweeks = await GameweekApi.getAllGameweeks();
        },
        async getGameweek(id: string) {
            this.gameweek = undefined;
            this.gameweekTeam = undefined;
            this.gameweek = await GameweekApi.getGameweek(id);
        },
        async getGameweekTeam(gwId: string, userId: string, skipFetch?: boolean) {
            if (!skipFetch) this.gameweekTeam = undefined;
            this.gameweekTeam = await FootballApi.getGameweekTeam(gwId, userId);
        },
        async createGameweekTeam(gwId: string) {
            const authStore = useAuthStore();
            if (!authStore.appUser) return;

            this.gameweekTeam = await FootballApi.createGameweekTeam(gwId, authStore.appUser.id);
        },
        async getUserPlayers(gwId?: string) {
            const authStore = useAuthStore();
            if (!authStore.appUser) return;

            this.userPlayers = await FootballApi.getUserPlayers(authStore.appUser.id, gwId);
        },
        async addTeamPlayers(teamId: string, playerIds: string[]) {
            await FootballApi.addTeamPlayers(teamId, playerIds);
        },
        async removeTeamPlayers(teamId: string, playerIds: string[]) {
            await FootballApi.removeTeamPlayers(teamId, playerIds);
        },
        async removeAllTeamPlayers(teamId: string) {
            await FootballApi.removeAllTeamPlayers(teamId);
        },
        async getPlayer(id: string, forceRefresh?: boolean) {
            if (forceRefresh) {
                this.playerDetailed = undefined;
            }
            this.playerDetailed = await FootballApi.getPlayer(id);
        },
        async getPrevGameweekTeam(gwId: string, userId: string) {
            this.prevGameweekTeam = undefined;
            this.prevGameweekTeam = await FootballApi.getGameweekTeam(gwId, userId);
        },
        async getPlayersAwayTeams(
            gameweek: GameweekContract,
            players: { sorare_slug: string; club_name_short: string | undefined }[]
        ) {
            try {
                const games = await getOrFetchGameweekGames(gameweek);

                const updates = players.flatMap((p) => {
                    const game = games.find(
                        (g) =>
                            g.home_team_name === p.club_name_short ||
                            g.away_team_name === p.club_name_short
                    );
                    if (!game) return [];

                    const away_team =
                        game.home_team_name === p.club_name_short
                            ? game.away_team_name
                            : game.home_team_name;

                    return [{ sorare_slug: p.sorare_slug, away_team }];
                });

                if (updates.length > 0) {
                    await FootballApi.updatePlayersAwayTeam(gameweek.id, updates);
                }
            } catch (error) {
                console.warn('Failed to derive players away teams:', error);
            }
        }
    }
});

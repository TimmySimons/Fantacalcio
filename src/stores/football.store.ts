import { defineStore } from 'pinia';
import type { GameweekContract } from '../model/gameweek.contract.ts';
import { FootballApi } from '../supabase/football.api.ts';
import type { TeamContract } from '../model/team.contract.ts';
import { useAuthStore } from './auth.store.ts';
import type { PlayerContract } from '../model/player.contract.ts';
import type { AppUserContract } from '../model/app-user.contract.ts';

interface FootballState {
    gameweeks: GameweekContract[] | undefined;
    gameweek: GameweekContract | undefined;
    gameweekTeam: TeamContract | undefined;
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
        userPlayers: undefined,
        managers: undefined,
        manager: undefined,
        playerDetailed: undefined
    }),
    getters: {
        nextGameWeek: (state) =>
            state.gameweeks && state.gameweek
                ? state.gameweeks.find((gw) => +gw.week === +state.gameweek!.week + 1)
                : undefined
    },
    actions: {
        async getManagers() {
            this.managers = await FootballApi.getAllManagers();
        },
        getManager(id: string) {
            this.manager = this.managers?.find((m) => m.id === id);
        },
        async getAllGameweeks() {
            this.gameweeks = await FootballApi.getAllGameweeks();
        },
        async getCurrentGameweek() {
            this.gameweekTeam = undefined;
            this.gameweek = await FootballApi.getCurrentGameweek();
        },
        async getUpcomingGameweek() {
            this.gameweekTeam = undefined;
            this.gameweek = await FootballApi.getUpcomingGameweek();
        },
        async getPastGameweek() {
            this.gameweekTeam = undefined;
            this.gameweek = await FootballApi.getPastGameweek();
        },
        async getGameweek(id: string) {
            this.gameweek = undefined;
            this.gameweekTeam = undefined;
            this.gameweek = await FootballApi.getGameweek(id);
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
        async getUserPlayers() {
            const authStore = useAuthStore();
            if (!authStore.appUser) return;

            this.userPlayers = await FootballApi.getUserPlayers(authStore.appUser.id);
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
        async getPlayer(id: string) {
            this.playerDetailed = undefined;
            this.playerDetailed = await FootballApi.getPlayer(id);
        }
    }
});

import { defineStore } from 'pinia';
import type { GameweekContract } from '../model/gameweek.contract.ts';
import { FootballApi } from '../supabase/football.api.ts';
import type { TeamContract } from '../model/team.contract.ts';
import { useAuthStore } from './auth.store.ts';
import type { PlayerContract } from '../model/player.contract.ts';

export const useFootballStore = defineStore('football-store', {
    state: (): {
        gameweeks: GameweekContract[] | undefined;
        gameweek: GameweekContract | undefined;
        gameweekTeam: TeamContract | undefined;
        userPlayers: PlayerContract[] | undefined;
    } => ({
        gameweeks: undefined,
        gameweek: undefined,
        gameweekTeam: undefined,
        userPlayers: undefined
    }),
    getters: {
        nextGameWeek: (state) =>
            state.gameweeks && state.gameweek
                ? state.gameweeks.find((gw) => +gw.week === +state.gameweek!.week + 1)
                : undefined
    },
    actions: {
        async getAllGameweeks() {
            this.gameweeks = await FootballApi.getAllGameweeks();
        },
        async getCurrentGameweek() {
            this.gameweek = await FootballApi.getCurrentGameweek();
        },
        async getGameweek(id: string) {
            this.gameweek = await FootballApi.getGameweek(id);
        },
        // TODO reuse for other players
        async getGameweekTeam(gwId: string) {
            const authStore = useAuthStore();
            if (!authStore.appUser) return;

            this.gameweekTeam = await FootballApi.getGameweekTeam(gwId, authStore.appUser.id);
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
        async addTeamPlayer(teamId: string, playerId: string) {
            await FootballApi.addTeamPlayer(teamId, playerId);
        },
        async removeTeamPlayers(teamId: string, playerIds: string[]) {
            await FootballApi.removeTeamPlayers(teamId, playerIds);
        },
        async removeAllTeamPlayers(teamId: string) {
            await FootballApi.removeAllTeamPlayers(teamId);
        }
    }
});

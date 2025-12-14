import { defineStore } from 'pinia';
import type { GameweekContract } from '../model/gameweek.contract.ts';
import { FootballApi } from '../supabase/football.api.ts';
import {
    type BasePlayerContract,
    type PlayerContract,
    PlayerPosition,
    type UpdatePlayerContract
} from '../model/player.contract.ts';
import type { AppUserContract } from '../model/app-user.contract.ts';
import { GameweekApi } from '../supabase/football/gameweek.api.ts';
import { useAuthStore } from './auth.store.ts';
import { SorareApi } from '../sorare/sorare.api.ts';

export const useAdminStore = defineStore('admin-store', {
    state: (): {
        gameweeks: GameweekContract[] | undefined;
        gameweek: GameweekContract | undefined;
        gameweekTeams:
            | {
                  team: { name: string; managerName: string };
                  players: { player: BasePlayerContract; teamPlayerId: number; score?: number }[];
              }[]
            | undefined;
        managers: AppUserContract[] | undefined;
        managerPlayers: PlayerContract[] | undefined;
        players: PlayerContract[] | undefined;
        player: PlayerContract | undefined;
    } => ({
        gameweeks: undefined,
        gameweek: undefined,
        gameweekTeams: undefined,
        managers: undefined,
        managerPlayers: undefined,
        players: undefined,
        player: undefined
    }),
    getters: {
        goalkeepers: (state) =>
            state.players
                ?.filter((p) => p.position === PlayerPosition.Goalkeeper)
                .sort((a, b) =>
                    (a.last_name ?? a.first_name).localeCompare(b.last_name ?? b.first_name)
                ) ?? [],
        defenders: (state) =>
            state.players
                ?.filter((p) => p.position === PlayerPosition.Defender)
                .sort((a, b) =>
                    (a.last_name ?? a.first_name).localeCompare(b.last_name ?? b.first_name)
                ) ?? [],
        midfielders: (state) =>
            state.players
                ?.filter((p) => p.position === PlayerPosition.Midfielder)
                .sort((a, b) =>
                    (a.last_name ?? a.first_name).localeCompare(b.last_name ?? b.first_name)
                ) ?? [],
        forwards: (state) =>
            state.players
                ?.filter((p) => p.position === PlayerPosition.Forward)
                .sort((a, b) =>
                    (a.last_name ?? a.first_name).localeCompare(b.last_name ?? b.first_name)
                ) ?? [],
        currentGameweek: (state) => {
            const now = new Date();
            return state.gameweeks
                ? state.gameweeks.find((gw) => gw.start_date <= now && gw.end_date >= now)
                : undefined;
        },
        previousGameweek: (state) => {
            if (!state.gameweeks || !state.gameweek) return undefined;

            const sorted = [...state.gameweeks].sort((a, b) => +a.week - +b.week);
            const idx = sorted.findIndex((gw) => +gw.week === +state.gameweek!.week);

            return idx > 0 ? sorted[idx - 1] : undefined;
        },
        nextGameweek: (state) => {
            if (!state.gameweeks || !state.gameweek) return undefined;

            const sorted = [...state.gameweeks].sort((a, b) => +a.week - +b.week);
            const idx = sorted.findIndex((gw) => +gw.week === +state.gameweek!.week);

            return idx >= 0 && idx < sorted.length - 1 ? sorted[idx + 1] : undefined;
        }
    },
    actions: {
        async getGameweeks(soft?: boolean) {
            if (!soft) this.gameweeks = undefined;
            this.gameweeks = await GameweekApi.getAllGameweeks();
        },
        async getGameweek(gameweekId: string, skipReset?: boolean) {
            if (!skipReset) this.gameweek = undefined;
            this.gameweek = await GameweekApi.getGameweek(gameweekId);
        },
        async deleteGameweek(gameweekId: string) {
            await GameweekApi.deleteGameweek(gameweekId);
            this.gameweek = undefined;
        },
        async getManagers() {
            let managers = await FootballApi.getAllManagers();
            if (!useAuthStore().hasSuperPowers) {
                managers = managers.filter((m) => m.name !== 'Hanne');
            }
            this.managers = managers;
        },
        async getManagerPlayers(managerId: string) {
            this.managerPlayers = await FootballApi.getUserPlayers(managerId);
        },
        async updateManagerPlayers(managerId: string, playerIds: string[]) {
            await FootballApi.updateUserPlayers(managerId, playerIds).then(() =>
                this.getManagerPlayers(managerId)
            );
        },
        async getPlayers() {
            this.players = await FootballApi.getPlayers();
        },
        async getPlayer(id: string, soft?: boolean) {
            if (!soft) this.player = undefined;
            this.player = await FootballApi.getPlayer(id);
        },
        async updatePlayer(playerId: string, sorareSlug: string, sorareData: any) {
            await FootballApi.updatePlayer(
                playerId,
                mapSorareDataToUpdateContract(sorareData, sorareSlug)
            );
        },
        async createPlayer(sorareSlug: string, sorareData: any): Promise<void> {
            await FootballApi.createPlayer(
                mapSorareDataToUpdateContract(sorareData, sorareSlug)
            ).then((id) => {
                this.getPlayer(id);
            });
        },
        async getGameweekTeams(gameweekId: string) {
            this.gameweekTeams = undefined;
            this.gameweekTeams = await FootballApi.getAllGameweekPlayers(gameweekId);
        },
        async updateGameweekScoredDate(gameweekId: string) {
            await GameweekApi.updateGameweekScoredDate(gameweekId);
            if (this.gameweek) {
                this.gameweek.scores_fetched_date = new Date();
            }
        },
        async updateGameweekScorePublishedDate(gameweekId: string) {
            await GameweekApi.updateGameweekScorePublishedDate(gameweekId);
            if (this.gameweek) {
                this.gameweek.scores_published_date = new Date();
            }
        },
        async autoAssignPreviousTeams(): Promise<{ assigned: number; failed: number }> {
            if (!this.gameweek || !this.gameweeks) {
                throw new Error('Gameweek data not loaded');
            }

            const sorted = [...this.gameweeks].sort((a, b) => +a.week - +b.week);
            const currentIdx = sorted.findIndex((gw) => +gw.week === +this.gameweek!.week);

            if (currentIdx <= 0) {
                return { assigned: 0, failed: 0 };
            }

            const previousGameweek = sorted[currentIdx - 1];
            return await FootballApi.autoAssignPreviousTeams(this.gameweek.id, previousGameweek.id);
        },
        async loadSorareGameweeks(): Promise<number> {
            if (!this.gameweeks) {
                throw new Error('Gameweeks data not loaded');
            }
            const latestGameweek = [...(this.gameweeks ?? [])].sort((a, b) => +b.week - +a.week)[0];

            const gameweeks = await SorareApi.getFutureGameweeks(latestGameweek?.start_date);
            const newGameweeks = gameweeks.filter(
                (gw: any) => !this.gameweeks?.map((g) => g.sorare_slug).includes(gw.sorare_slug)
            );

            await FootballApi.createGameweeks(
                newGameweeks.map((gw: any) => ({
                    ...gw,
                    year: gw.start_date.getFullYear()
                }))
            );

            return newGameweeks.length;
        }
    }
});

const mapSorareDataToUpdateContract = (
    sorareData: any,
    sorareSlug: string
): UpdatePlayerContract => {
    return {
        first_name: sorareData.firstName,
        last_name: sorareData.lastName,
        position: sorareData.position,
        picture_url: sorareData.squaredPictureUrl,
        height: sorareData.height,
        weight: sorareData.weight,
        birth_date: sorareData.birthDate,
        country: sorareData.country.name,
        country_flag_picture_url: sorareData.country.flagUrl,
        shirt_number: sorareData.shirtNumber,
        club_name_short: sorareData.activeClub.shortName,
        club_picture_url: sorareData.activeClub.pictureUrl,
        sorare_last_updated: new Date(),
        sorare_slug: sorareSlug
    };
};

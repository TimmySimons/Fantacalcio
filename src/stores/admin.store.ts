import { defineStore } from 'pinia';
import type { GameweekContract } from '../model/gameweek.contract.ts';
import { FootballApi } from '../supabase/football.api.ts';
import {
    type PlayerContract,
    PlayerPosition,
    type UpdatePlayerContract
} from '../model/player.contract.ts';
import type { AppUserContract } from '../model/app-user.contract.ts';

export const useAdminStore = defineStore('admin-store', {
    state: (): {
        gameweeks: GameweekContract[] | undefined;
        currentGameweek: GameweekContract | undefined;
        upcomingGameweek: GameweekContract | undefined;
        managers: AppUserContract[] | undefined;
        players: PlayerContract[] | undefined;
        managerPlayers: PlayerContract[] | undefined;
        player: PlayerContract | undefined;
    } => ({
        gameweeks: undefined,
        currentGameweek: undefined,
        upcomingGameweek: undefined,
        managers: undefined,
        players: undefined,
        managerPlayers: undefined,
        player: undefined
    }),
    getters: {
        goalkeepers: (state) =>
            state.players
                ?.filter((p) => p.position === PlayerPosition.Goalkeeper)
                .sort((a, b) => a.first_name.localeCompare(b.first_name)) ?? [],
        defenders: (state) =>
            state.players
                ?.filter((p) => p.position === PlayerPosition.Defender)
                .sort((a, b) => a.first_name.localeCompare(b.first_name)) ?? [],
        midfielders: (state) =>
            state.players
                ?.filter((p) => p.position === PlayerPosition.Midfielder)
                .sort((a, b) => a.first_name.localeCompare(b.first_name)) ?? [],
        forwards: (state) =>
            state.players
                ?.filter((p) => p.position === PlayerPosition.Forward)
                .sort((a, b) => a.first_name.localeCompare(b.first_name)) ?? []
    },
    actions: {
        async getGameweeks() {
            this.gameweeks = await FootballApi.getAllGameweeks();
        },
        async getManagers() {
            this.managers = await FootballApi.getAllManagers();
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
        async getCurrentGameweek() {
            this.currentGameweek = await FootballApi.getCurrentGameweek();
        },
        async getUpcomingGameweek() {
            this.upcomingGameweek = await FootballApi.getUpcomingGameweek();
        },
        async getPlayer(id: string) {
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

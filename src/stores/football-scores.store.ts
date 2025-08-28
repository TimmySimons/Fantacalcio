import { defineStore } from 'pinia';
import type {
    GameweekTeamPlayerContract,
    UserGameweeksTeamPlayersContract
} from '../model/gameweek.contract.ts';
import { FootballApi } from '../supabase/football.api.ts';
import type { PlayerAverageScoresContract } from '../model/player.contract.ts';

interface FootballScoreState {
    userGameWeeksTeamPlayers: GameweekTeamPlayerContract[] | undefined;
    allUsersGamesWeekTeamPlayers: UserGameweeksTeamPlayersContract[] | undefined;
}
export const useFootballScoreStore = defineStore('football-scores-store', {
    state: (): FootballScoreState => ({
        userGameWeeksTeamPlayers: undefined,
        allUsersGamesWeekTeamPlayers: undefined
    }),
    getters: {
        totalUserScore() {
            return (userId: string) =>
                this.allUsersGamesWeekTeamPlayers
                    ?.filter((g) => g.id === userId)
                    .flatMap((g) => g.Teams)
                    .flatMap((t) => t.TeamPlayers)
                    .reduce((acc, g) => acc + (g.score ?? 0), 0);
        },
        gameweekUserScore() {
            return (gameweekId: string) =>
                this.userGameWeeksTeamPlayers
                    ?.filter((g) => g.gameweek_id === gameweekId)
                    .flatMap((t) => t.TeamPlayers)
                    .reduce((acc, g) => acc + (g.score ?? 0), 0);
        }
    },
    actions: {
        async getAllUsersGameweeksTeamPlayers() {
            this.allUsersGamesWeekTeamPlayers = await FootballApi.getAllUsersGameweeksTeamPlayers();
        },
        async getUserGameweeksTeamPlayers(userId: string) {
            this.userGameWeeksTeamPlayers = await FootballApi.getUserGameweeksTeamPlayers(userId);
        },
        async createPlayerAverageScores(playerId: string, sorareScores: any) {
            await FootballApi.createPlayerAverageScores(
                playerId,
                mapSorareScoresToScoresContract(sorareScores)
            );
        },
        async updatePlayerAverageScores(playerId: string, sorareScores: any) {
            await FootballApi.updatePlayerAverageScores(
                playerId,
                mapSorareScoresToScoresContract(sorareScores)
            );
        }
    }
});

const mapSorareScoresToScoresContract = (sorareData: any): PlayerAverageScoresContract => {
    return {
        last_five_appearances: sorareData.lastFiveSo5Appearances,
        average_last_five: sorareData.average5,
        average_last_five_decisive: sorareData.decisiveAverage5,
        average_last_five_all_round: sorareData.allAroundAverage5,
        last_fifteen_appearances: sorareData.lastFifteenSo5Appearances,
        average_last_fifteen: sorareData.average15,
        average_last_fifteen_decisive: sorareData.decisiveAverage15,
        average_last_fifteen_all_round: sorareData.allAroundAverage15,
        last_forty_appearances: sorareData.lastFortySo5Appearances,
        average_forty: sorareData.average40,
        average_forty_decisive: sorareData.decisiveAverage40,
        average_forty_all_round: sorareData.allAroundAverage40
    };
};

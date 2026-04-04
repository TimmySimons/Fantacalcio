import type { PlayerPosition } from '../model/player.contract.ts';
import { supabase } from '../supabase/supabase.ts';
import type { GetGameweekGamesResponse } from './contracts/gameweek-games.contract.ts';
import type { GetGameweekScoresResponse } from './contracts/gameweek-scores.contract.ts';
import type { GetGameweeksResponse } from './contracts/gameweeks.contract.ts';
import type { GetPlayerResponse } from './contracts/player.contract.ts';
import type { GetPlayersAwayTeamsResponse } from './contracts/players-away-teams.contract.ts';
import type { GetPlayersScoresResponse } from './contracts/scores.contract.ts';

type EdgeFunctionResponse<T> = { data: T };

async function invoke<T>(fn: string, params?: Record<string, unknown>): Promise<T> {
    const { data, error } = await supabase.functions.invoke<EdgeFunctionResponse<T>>(fn, {
        body: params ?? {}
    });
    if (error || !data) throw error;
    return data.data;
}

export class SorareApi {
    public static async getPlayerStats(slug: string) {
        const data = await invoke<GetPlayerResponse>('player', { slug });
        console.log('Sorare:', data);
        return data.football.player;
    }

    public static async getPlayersAverageScores(slugs: string[]) {
        const data = await invoke<GetPlayersScoresResponse>('scores', { slugs });
        console.log('Sorare:', data);
        return data.football.players;
    }

    public static async getPlayersGameweekScores(
        gwSlug: string,
        slugs: string[],
        position: PlayerPosition
    ): Promise<GetGameweekScoresResponse['football']['players']> {
        if (slugs.length === 0 || !position || !gwSlug) {
            return [];
        }

        const data = await invoke<GetGameweekScoresResponse>('gameweek-scores', {
            slugs,
            gwslug: gwSlug,
            position
        });
        console.log('Sorare:', data);
        return data.football.players;
    }

    public static async getFutureGameweeks(after?: Date) {
        const data = await invoke<GetGameweeksResponse>('gameweeks');
        const result = data.so5.allSo5Fixtures.edges
            .map((e) => ({
                sorare_slug: e.node.slug,
                start_date: new Date(e.node.startDate),
                end_date: new Date(e.node.endDate),
                week: e.node.seasonGameWeek
            }))
            .filter((gw) => gw.start_date > (after ?? new Date()));
        console.log('Sorare:', result);
        return result;
    }

    public static async getGameweekGames(slug: string, fromDate: string, toDate: string) {
        const data = await invoke<GetGameweekGamesResponse>('gameweek-games', {
            slug,
            fromDate,
            toDate
        });

        const jupilerProLeagueGames = data.so5.so5Fixture.games.filter(
            (g) => g.competition.slug === 'jupiler-pro-league'
        );
        console.log('Sorare:', jupilerProLeagueGames);
        return jupilerProLeagueGames;
    }

    public static async getPlayersAwayTeams(playerSlugs: string[], gameweekSlug: string) {
        const data = await invoke<GetPlayersAwayTeamsResponse>('players-away-teams', {
            playerSlugs,
            gameweekSlug
        });
        const result = data.football.players.map((p) => ({
            sorare_slug: p.slug,
            away_team: p.anyGamesForFixture
                .map((e) => ({
                    name: e.homeTeam.name === p.activeClub.name ? e.awayTeam.name : e.homeTeam.name
                }))
                .pop()
        }));
        console.log('Sorare:', result);
        return result;
    }
}

import type { PlayerPosition } from '../model/player.contract.ts';

export class SorareApi {
    public static async getPlayerStats(slug: string) {
        const vercelPath = import.meta.env.VITE_VERCEL_URL;

        return await fetch(`${vercelPath}/api/player?slug=${slug}`)
            .then((res) => res.json())
            .then((data) => {
                console.log('Sorare:', data);
                return data.data.football.player;
            });
    }

    public static async getPlayersAverageScores(slugs: string[]) {
        const vercelPath = import.meta.env.VITE_VERCEL_URL;

        return await fetch(`${vercelPath}/api/scores?slugs=${slugs.join(',')}`)
            .then((res) => res.json())
            .then((data) => {
                console.log('Sorare:', data);
                return data.data.football.players;
            });
    }

    public static async getPlayersGameweekScores(
        gwSlug: string,
        slugs: string[],
        position: PlayerPosition
    ): Promise<
        {
            slug: string;
            anyGameStats: {
                playerGameScore: {
                    score: number;
                };
            }[];
        }[]
    > {
        const vercelPath = import.meta.env.VITE_VERCEL_URL;

        if (slugs.length === 0 || !position || !gwSlug) {
            return [];
        }

        return await fetch(
            `${vercelPath}/api/gameweek-scores?gwslug=${gwSlug}&position=${position}&slugs=${slugs.join(
                ','
            )}`
        )
            .then((res) => res.json())
            .then((data) => {
                console.log('Sorare:', data);
                return data.data.football.players;
            });
    }

    public static async getFutureGameweeks(after?: Date) {
        const vercelPath = import.meta.env.VITE_VERCEL_URL;

        return await fetch(`${vercelPath}/api/gameweeks`)
            .then((res) => res.json())
            .then((data) => {
                const result = data.data.so5.allSo5Fixtures.edges
                    .map((e: any) => ({
                        sorare_slug: e.node.slug,
                        start_date: new Date(e.node.startDate),
                        end_date: new Date(e.node.endDate),
                        week: e.node.seasonGameWeek
                    }))
                    .filter((gw: any) => gw.start_date > (after ?? new Date()));
                console.log('Sorare:', result);
                return result;
            });
    }

    public static async getPlayersAwayTeams(playerSlugs: string[], gameweekSlug: string) {
        const vercelPath = import.meta.env.VITE_VERCEL_URL;

        return await fetch(
            `${vercelPath}/api/players-away-teams?playerSlugs=${playerSlugs.join(
                ','
            )}&gameweekSlug=${gameweekSlug}`
        )
            .then((res) => res.json())
            .then((data) => {
                const result = data.data.football.players.map((p: any) => {
                    return {
                        sorare_slug: p.slug,
                        away_team: p.anyGamesForFixture
                            .map((e: any) => ({
                                name:
                                    e.homeTeam.name === p.activeClub.name
                                        ? e.awayTeam.name
                                        : e.homeTeam.name
                            }))
                            .pop()
                    };
                });
                console.log('Sorare:', result);
                return result;
            });
    }
}

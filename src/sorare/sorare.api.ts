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
        slugs: string[]
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

        return await fetch(
            `${vercelPath}/api/gameweek-scores?gwslug=${gwSlug}&slugs=${slugs.join(',')}`
        )
            .then((res) => res.json())
            .then((data) => {
                console.log('Sorare:', data);
                return data.data.football.players;
            });
    }
}

export class SorareApi {
    public static async getPlayerStats(slug: string) {
        console.log('Vercel: getVercelPlayStats');

        const vercelPath = import.meta.env.VITE_VERCEL_URL;

        return await fetch(`${vercelPath}/api/player?slug=${slug}`)
            .then((res) => res.json())
            .then((data) => {
                console.log('Sorare:', data);
                return data.data.football.player;
            });
    }
}

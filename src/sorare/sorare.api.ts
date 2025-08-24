export class SorareApi {
    public static async getPlayerStats(slug: string) {
        console.log('Vercel: getVercelPlayStats');

        return await fetch(`/api/player?slug=${slug}`)
            .then((res) => res.json())
            .then((data) => {
                console.log('Sorare:', data);
                return data.data.football.player;
            });
    }
}

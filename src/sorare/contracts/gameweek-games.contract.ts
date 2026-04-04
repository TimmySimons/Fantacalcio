export interface GetGameweekGamesResponse {
    so5: {
        so5Fixture: {
            games: {
                date: string;
                statusTyped: string; // 'scheduled' , 'playing', 'played'
                competition: { slug: string };
                homeTeam: { shortName: string; code: string; pictureUrl: string };
                awayTeam: { shortName: string; code: string; pictureUrl: string };
                homeScore: number | null;
                awayScore: number | null;
            }[];
        };
    };
}

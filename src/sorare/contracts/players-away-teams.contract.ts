export type GetPlayersAwayTeamsResponse = {
    football: {
        players: {
            slug: string;
            activeClub: {
                name: string;
            };
            anyGamesForFixture: {
                awayTeam: {
                    name: string;
                };
                homeTeam: {
                    name: string;
                };
            }[];
        }[];
    };
};
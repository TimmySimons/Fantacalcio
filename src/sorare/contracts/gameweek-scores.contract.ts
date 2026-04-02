export type GetGameweekScoresResponse = {
    football: {
        players: {
            slug: string;
            anyGameStats: {
                playerGameScore: {
                    position: string;
                    score: number;
                };
            }[];
        }[];
    };
};
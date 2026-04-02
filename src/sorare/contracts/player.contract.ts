export type GetPlayerResponse = {
    football: {
        player: {
            displayName: string;
            abbreviatedName: string;
            firstName: string;
            lastName: string;
            position: string;
            shirtNumber: number;
            birthDate: string;
            height: number;
            weight: number;
            country: {
                name: string;
                flagUrl: string;
            };
            activeClub: {
                name: string;
                pictureUrl: string;
                shortName: string;
            };
            squaredPictureUrl: string;
            so5Scores: {
                score: number;
                decisiveScore: {
                    totalScore: number;
                };
                game: {
                    date: string;
                    homeTeam: {
                        name: string;
                    };
                    awayTeam: {
                        name: string;
                        shortName: string;
                    };
                };
            }[];
            futureGames: {
                edges: {
                    node: {
                        date: string;
                        awayTeam: {
                            shortName: string;
                        };
                    };
                }[];
            };
            lastFiveSo5Appearances: number;
        };
    };
};
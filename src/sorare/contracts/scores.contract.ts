export type GetPlayersScoresResponse = {
    football: {
        players: {
            slug: string;
            lastFiveSo5Appearances: number;
            lastFifteenSo5Appearances: number;
            lastFortySo5Appearances: number;
            average5: number;
            decisiveAverage5: number;
            allAroundAverage5: number;
            average15: number;
            decisiveAverage15: number;
            allAroundAverage15: number;
            average40: number;
            decisiveAverage40: number;
            allAroundAverage40: number;
        }[];
    };
};
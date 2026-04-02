export type GetGameweeksResponse = {
    so5: {
        allSo5Fixtures: {
            edges: {
                node: {
                    seasonGameWeek: number;
                    startDate: string;
                    endDate: string;
                    slug: string;
                };
            }[];
        };
    };
};
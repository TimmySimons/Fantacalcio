export interface Season {
    startYear: number;
    endYear: number;
    label: string;
}

export class SeasonUtil {
    // Hardcoded cutoff between seasons: no DB support for seasons yet.
    private static readonly CUTOFF_MONTH = 6; // June
    private static readonly CUTOFF_DAY = 15;

    public static getSeasonForDate(date: Date): Season {
        const year = date.getFullYear();
        const cutoff = new Date(year, SeasonUtil.CUTOFF_MONTH - 1, SeasonUtil.CUTOFF_DAY);

        const startYear = date >= cutoff ? year : year - 1;
        const endYear = startYear + 1;

        return { startYear, endYear, label: `${startYear}-${endYear}` };
    }

    public static getCurrentSeason(): Season {
        return SeasonUtil.getSeasonForDate(new Date());
    }

    public static isInSeason(date: Date, season: Season): boolean {
        return SeasonUtil.getSeasonForDate(date).startYear === season.startYear;
    }

    public static fromStartYear(startYear: number): Season {
        return { startYear, endYear: startYear + 1, label: `${startYear}-${startYear + 1}` };
    }

    public static getSeasonsFromDates(dates: Date[]): Season[] {
        const seasons = new Map<number, Season>();
        for (const date of dates) {
            const season = SeasonUtil.getSeasonForDate(date);
            seasons.set(season.startYear, season);
        }

        return [...seasons.values()].sort((a, b) => b.startYear - a.startYear);
    }
}

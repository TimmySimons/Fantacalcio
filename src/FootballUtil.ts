import type { GameweekContract } from './model/gameweek.contract.ts';

export class FootballUtil {
    public static isLockedGameweek(gameweek: GameweekContract | undefined): boolean {
        if (!gameweek) return true;

        const now = new Date();
        const start = new Date(gameweek.start_date);

        return now >= start;
    }

    public static isCurrentGameweek(gameweek: GameweekContract | undefined): boolean {
        if (!gameweek) return false;

        const now = new Date();
        const start = new Date(gameweek.start_date);
        const end = new Date(gameweek.end_date);

        return now >= start && now <= end;
    }
}

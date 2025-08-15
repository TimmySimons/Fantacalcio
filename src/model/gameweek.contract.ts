import type { TeamContract } from './team.contract.ts';

export interface GameweekContract {
    id: string;
    start_date: Date;
    end_date: Date;
    week: number;
    year: number;
    team?: TeamContract;
}

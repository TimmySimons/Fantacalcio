import type { TeamContract } from './team.contract.ts';

export interface GameweekContract {
    id: string;
    start_date: Date;
    end_date: Date;
    week: number;
    year: number;
    team?: TeamContract;
}

export interface GameweekTeamPlayerContract {
    gameweek_id: string;
    user_id: string;
    TeamPlayers: { id: string; score: number | null }[];
}

export interface UserGameweeksTeamPlayersContract {
    id: string;
    Teams: GameweekTeamPlayerContract[];
}

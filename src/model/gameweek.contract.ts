import type { TeamContract } from './team.contract.ts';

export interface GameweekContract {
    id: string;
    sorare_slug: string;
    start_date: Date;
    end_date: Date;
    week: number;
    year: number;
    scores_fetched_date: Date | null;
    scores_published_date: Date | null;
    //
    team?: TeamContract;
}

export interface createGameweekContract {
    sorare_slug: string;
    start_date: Date;
    end_date: Date;
    week: number;
    year: number;
}

export interface GameweekTeamPlayerContract {
    gameweek_id: string;
    Gameweeks: { scores_published_date: Date | null };
    user_id: string;
    TeamPlayers: { id: string; score: number | null }[];
}

export interface UserGameweeksTeamPlayersContract {
    id: string;
    Teams: GameweekTeamPlayerContract[];
}

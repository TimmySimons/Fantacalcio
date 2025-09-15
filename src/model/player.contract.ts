export enum PlayerPosition {
    Goalkeeper = 'Goalkeeper',
    Defender = 'Defender',
    Midfielder = 'Midfielder',
    Forward = 'Forward'
}

export interface BasePlayerContract {
    id: string;
    sorare_slug: string;
    first_name: string;
    last_name: string | undefined;
    club_name_short: string | undefined;
    position: PlayerPosition;
}

export interface PlayerContract extends BasePlayerContract {
    next_opponent_club: string | undefined;
    // Sorare data
    sorare_last_updated: Date | undefined;
    picture_url: string | undefined;
    height: number | undefined;
    weight: number | undefined;
    birth_date: Date | undefined;
    country: string | undefined;
    country_flag_picture_url: string | undefined;
    shirt_number: string | undefined;
    club_picture_url: string | undefined;
    PlayerSorareAverages: PlayerAverageScoresContract | undefined;
}

export interface PlayerWithScoreContract extends PlayerContract {
    score?: number | null | undefined;
}

export interface UpdatePlayerContract {
    first_name?: string;
    last_name?: string;
    position?: PlayerPosition;
    picture_url?: string;
    height?: number;
    weight?: number;
    birth_date?: Date;
    country?: string;
    country_flag_picture_url?: string;
    shirt_number?: string;
    club_name_short?: string;
    club_picture_url?: string;
    sorare_last_updated: Date;
    sorare_slug: string;
}

export interface PlayerAverageScoresContract {
    last_five_appearances: number | null;
    average_last_five: number | null;
    average_last_five_decisive: number | null;
    average_last_five_all_round: number | null;
    last_fifteen_appearances: number | null;
    average_last_fifteen: number | null;
    average_last_fifteen_decisive: number | null;
    average_last_fifteen_all_round: number | null;
    last_forty_appearances: number | null;
    average_forty: number | null;
    average_forty_decisive: number | null;
    average_forty_all_round: number | null;
}

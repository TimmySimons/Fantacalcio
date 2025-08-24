export enum PlayerPosition {
    Goalkeeper = 'Goalkeeper',
    Defender = 'Defender',
    Midfielder = 'Midfielder',
    Forward = 'Forward'
}

export interface PlayerContract {
    id: string;
    first_name: string;
    last_name: string | undefined;
    position: PlayerPosition;
    next_opponent_club: string | undefined;
    sorare_slug: string | undefined;
    // Sorare data
    sorare_last_updated: Date | undefined;
    picture_url: string | undefined;
    height: number | undefined;
    weight: number | undefined;
    birth_date: Date | undefined;
    country: string | undefined;
    country_flag_picture_url: string | undefined;
    shirt_number: string | undefined;
    club_name_short: string | undefined;
    club_picture_url: string | undefined;
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

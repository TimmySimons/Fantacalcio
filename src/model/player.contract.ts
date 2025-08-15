export enum PlayerPosition {
    Goalkeeper = 'Goalkeeper',
    Defender = 'Defender',
    Midfielder = 'Midfielder',
    Forward = 'Forward'
}

export interface PlayerContract {
    id: string;
    first_name: string;
    last_name: string;
    club: string;
    position: PlayerPosition;
    next_opponent_club: string | undefined;
}

export enum PlayerPosition {
    Goalkeeper = 'Goalkeeper',
    Defender = 'Defender',
    Midfielder = 'Midfielder',
    Forward = 'Forward'
}

export interface PlayerContract {
    id: string;
    firstName: string;
    lastName: string;
    team: string;
    position: PlayerPosition;
}

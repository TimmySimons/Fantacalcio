export enum PlayerPosition {
    Goalkeeper = 'Goalkeeper',
    Defender = 'Defender',
    Midfielder = 'Midfielder',
    Attacker = 'Attacker'
}

export interface PlayerContract {
    id: string;
    firstName: string;
    lastName: string;
    team: string;
    position: PlayerPosition;
}

export interface TeamContract {
    id: string;
    gameWeek: string;
    playersIds: string[];
}

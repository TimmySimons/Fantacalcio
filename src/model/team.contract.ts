import type { PlayerContract } from './player.contract.ts';
import type { GameweekContract } from './gameweek.contract.ts';

export interface TeamContract {
    id: string;
    gameWeek: GameweekContract;
    players: PlayerContract[];
    includedPlayers: PlayerContract[];
}

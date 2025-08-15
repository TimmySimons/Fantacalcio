import type { PlayerContract } from './player.contract.ts';

export interface TeamContract {
    id: string;
    team_players: PlayerContract[];
}

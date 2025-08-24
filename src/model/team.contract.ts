import type { PlayerWithScoreContract } from './player.contract.ts';

export interface TeamContract {
    id: string;
    team_players: PlayerWithScoreContract[];
}

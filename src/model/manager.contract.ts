import type { AppUserContract } from './app-user.contract.ts';

export interface ManagerContract extends AppUserContract {
    totalScore: number;
    lastGameweekScore: number;
}

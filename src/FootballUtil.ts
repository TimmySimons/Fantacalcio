import type { GameweekContract } from './model/gameweek.contract.ts';
import { type PlayerContract, PlayerPosition } from './model/player.contract.ts';

export class FootballUtil {
    public static isLockedGameweek(gameweek: GameweekContract | undefined): boolean {
        if (!gameweek) return true;

        const now = new Date();
        const start = new Date(gameweek.start_date);

        return now >= start;
    }

    public static isCurrentGameweek(gameweek: GameweekContract | undefined): boolean {
        if (!gameweek) return false;

        const now = new Date();
        const start = new Date(gameweek.start_date);
        const end = new Date(gameweek.end_date);

        return now >= start && now <= end;
    }

    public static isSelectedBenchPlayerDisabled = (
        playersOnField: PlayerContract[] | undefined,
        selectedPlayer: PlayerContract | undefined
    ): boolean => {
        if (!playersOnField || !selectedPlayer) return false;

        // Already on the field → cannot be disabled
        if (playersOnField.some((p) => p.id === selectedPlayer.id)) {
            return false;
        }

        const total = playersOnField.length;

        if (total >= 11) return true;

        // Count current players by position
        const counts = {
            [PlayerPosition.Goalkeeper]: playersOnField.filter(
                (p) => p.position === PlayerPosition.Goalkeeper
            ).length,
            [PlayerPosition.Defender]: playersOnField.filter(
                (p) => p.position === PlayerPosition.Defender
            ).length,
            [PlayerPosition.Midfielder]: playersOnField.filter(
                (p) => p.position === PlayerPosition.Midfielder
            ).length,
            [PlayerPosition.Forward]: playersOnField.filter(
                (p) => p.position === PlayerPosition.Forward
            ).length
        };

        const max = {
            [PlayerPosition.Goalkeeper]: 1,
            [PlayerPosition.Defender]: 5,
            [PlayerPosition.Midfielder]: 5,
            [PlayerPosition.Forward]: 3
        };

        const min = {
            [PlayerPosition.Goalkeeper]: 1,
            [PlayerPosition.Defender]: 3,
            [PlayerPosition.Midfielder]: 2,
            [PlayerPosition.Forward]: 1
        };

        // Rule 1: block if adding would exceed the max for that position
        if (counts[selectedPlayer.position] >= max[selectedPlayer.position]) {
            return true;
        }

        // Rule 2: prevent adding "wrong" positions if it would make meeting minimums impossible
        const slotsLeft = 11 - total - 1; // after adding this player
        let mustFill = 0;

        for (const pos of Object.keys(min) as PlayerPosition[]) {
            const deficit = min[pos] - (counts[pos] + (pos === selectedPlayer.position ? 1 : 0));
            if (deficit > 0) mustFill += deficit;
        }

        if (mustFill > slotsLeft) {
            return true;
        }

        return false;
    };

    public static getRandomTeam(players: PlayerContract[]): PlayerContract[] {
        const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

        const keepers = players.filter((p) => p.position === PlayerPosition.Goalkeeper);
        const defenders = players.filter((p) => p.position === PlayerPosition.Defender);
        const mids = players.filter((p) => p.position === PlayerPosition.Midfielder);
        const forwards = players.filter((p) => p.position === PlayerPosition.Forward);

        // Ensure minimums
        if (keepers.length < 1) throw new Error('Not enough goalkeepers');
        if (defenders.length < 3) throw new Error('Not enough defenders');
        if (mids.length < 2) throw new Error('Not enough midfielders');
        if (forwards.length < 1) throw new Error('Not enough forwards');

        // Constraints
        const min = { GK: 1, DEF: 3, MID: 2, FWD: 1 };
        const max = { GK: 1, DEF: 5, MID: 5, FWD: 3 };

        // Generate all valid (DEF, MID, FWD) distributions that total 10 outfield players
        const validFormations: [number, number, number][] = [];
        for (let d = min.DEF; d <= Math.min(max.DEF, defenders.length); d++) {
            for (let m = min.MID; m <= Math.min(max.MID, mids.length); m++) {
                for (let f = min.FWD; f <= Math.min(max.FWD, forwards.length); f++) {
                    if (d + m + f === 10) {
                        validFormations.push([d, m, f]);
                    }
                }
            }
        }

        if (validFormations.length === 0) {
            throw new Error('Not enough players for any valid formation');
        }

        // Pick a random valid formation
        const [dCount, mCount, fCount] =
            validFormations[Math.floor(Math.random() * validFormations.length)];

        // Build the team
        const team: PlayerContract[] = [];
        team.push(shuffle(keepers)[0]); // always 1 keeper
        team.push(...shuffle(defenders).slice(0, dCount));
        team.push(...shuffle(mids).slice(0, mCount));
        team.push(...shuffle(forwards).slice(0, fCount));

        return shuffle(team);
    }

    public static getColorByValue(value: number): string {
        if (value >= 75 && value <= 99) {
            return '#006995';
        } else if (value >= 60 && value <= 74) {
            return '#016e01';
        } else if (value >= 50 && value <= 59) {
            return '#72a328';
        } else if (value >= 35 && value <= 49) {
            return '#9c9c24';
        } else if (value >= 20 && value <= 34) {
            return '#986400';
        } else if (value >= 0 && value <= 19) {
            return '#af2b2b';
        } else if (value >= 100) {
            return '#C0C0C0';
        } else {
            return '#000000';
        }
    }
}

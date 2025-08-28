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
    ) => {
        if (!playersOnField || !selectedPlayer) return false;
        if (playersOnField.map((p) => p.id).includes(selectedPlayer.id)) return false;

        if (playersOnField.length >= 11) return true;
        if (
            !playersOnField.find((p) => p.position === PlayerPosition.Goalkeeper) &&
            selectedPlayer.position !== PlayerPosition.Goalkeeper &&
            playersOnField.length >= 10
        ) {
            return true;
        }

        const includedPlayersOfType = playersOnField.filter(
            (p) => p.position === selectedPlayer!.position
        );

        if (selectedPlayer.position === 'Goalkeeper') {
            if (includedPlayersOfType.length >= 1) return true;
        } else if (includedPlayersOfType.length >= 4) return true;

        return false;
    };

    public static getRandomTeam(players: PlayerContract[]) {
        const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

        const keepers = players.filter((p) => p.position === PlayerPosition.Goalkeeper);
        const defenders = players.filter((p) => p.position === PlayerPosition.Defender);
        const mids = players.filter((p) => p.position === PlayerPosition.Midfielder);
        const forwards = players.filter((p) => p.position === PlayerPosition.Forward);

        if (keepers.length < 1) throw new Error('Not enough goalkeepers');
        if (defenders.length < 2) throw new Error('Not enough defenders');
        if (mids.length < 2) throw new Error('Not enough midfielders');
        if (forwards.length < 2) throw new Error('Not enough forwards');

        const allowedFormations = [
            [4, 4, 2],
            [4, 3, 3],
            [3, 5, 2],
            [3, 4, 3],
            [4, 2, 4],
            [2, 4, 4]
        ];

        const validFormations = allowedFormations.filter(
            ([d, m, f]) => defenders.length >= d && mids.length >= m && forwards.length >= f
        );

        if (validFormations.length === 0) {
            throw new Error('Not enough players for any valid formation');
        }

        const [dCount, mCount, fCount] =
            validFormations[Math.floor(Math.random() * validFormations.length)];

        const team: PlayerContract[] = [];
        team.push(shuffle(keepers)[0]);
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

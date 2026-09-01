import type { GameweekContract } from './model/gameweek.contract.ts';
import { GameweekApi } from './supabase/football/gameweek.api.ts';
import { SorareApi } from './sorare/sorare.api.ts';

export type GameweekGame = Awaited<ReturnType<typeof GameweekApi.getGameweekGames>>[number];

const GAMES_STALE_MS = 60 * 60 * 1000;

export async function getOrFetchGameweekGames(gameweek: GameweekContract): Promise<GameweekGame[]> {
    const cached = await GameweekApi.getGameweekGames(gameweek.id);
    const now = Date.now();
    const started = new Date(gameweek.start_date).getTime() < now;
    const ended = new Date(gameweek.end_date).getTime() < now;

    if (cached.length > 0) {
        if (!started || ended) {
            return cached;
        }
        const lastUpdated = Math.max(...cached.map((g) => new Date(g.updated_at).getTime()));
        if (now - lastUpdated < GAMES_STALE_MS) {
            return cached;
        }
    }

    const games = await SorareApi.getGameweekGames(
        gameweek.sorare_slug,
        new Date(gameweek.start_date).toISOString().split('T')[0],
        new Date(gameweek.end_date).toISOString().split('T')[0]
    );
    await GameweekApi.saveGameweekGames(gameweek.id, games);
    return await GameweekApi.getGameweekGames(gameweek.id);
}

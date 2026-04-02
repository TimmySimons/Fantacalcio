import { gqlFetch } from '../_shared/sorare-client.ts';

const GET_PLAYERS_SCORES = `
    query GetPlayersScores($slugs: [String!]!) {
        football {
            players(slugs: $slugs) {
                slug
                lastFiveSo5Appearances
                lastFifteenSo5Appearances
                lastFortySo5Appearances
                average5: averageScore(type: LAST_FIVE_SO5_AVERAGE_SCORE)
                decisiveAverage5: averageScore(type: LAST_FIVE_AVERAGE_DECISIVE_SCORE)
                allAroundAverage5: averageScore(type: LAST_FIVE_AVERAGE_ALL_AROUND_SCORE)
                average15: averageScore(type: LAST_FIFTEEN_SO5_AVERAGE_SCORE)
                decisiveAverage15: averageScore(type: LAST_FIFTEEN_AVERAGE_DECISIVE_SCORE)
                allAroundAverage15: averageScore(type: LAST_FIFTEEN_AVERAGE_ALL_AROUND_SCORE)
                average40: averageScore(type: LAST_FORTY_SO5_AVERAGE_SCORE)
                decisiveAverage40: averageScore(type: LAST_FORTY_AVERAGE_DECISIVE_SCORE)
                allAroundAverage40: averageScore(type: LAST_FORTY_AVERAGE_ALL_AROUND_SCORE)
            }
        }
    }
`;

Deno.serve(async (req) => {
    try {
        const { slugs } = await req.json();

        if (!slugs) {
            return new Response(JSON.stringify({ error: 'Missing slugs parameter' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await gqlFetch(GET_PLAYERS_SCORES, { slugs });

        return new Response(JSON.stringify({ data }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});
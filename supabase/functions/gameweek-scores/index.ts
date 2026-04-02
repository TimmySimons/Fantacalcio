import { gqlFetch } from '../_shared/sorare-client.ts';

const GET_GAMEWEEK_SCORES = `
    query GetGameweekScores($slugs: [String!]!, $gwslug: String!, $position: String!) {
        football {
            players(slugs: $slugs) {
                slug
                anyGameStats(so5FixtureSlug: $gwslug, last: 1) {
                    playerGameScore(position: $position) {
                        position
                        score
                    }
                }
            }
        }
    }
`;

Deno.serve(async (req) => {
    try {
        const { slugs, gwslug, position } = await req.json();

        if (!slugs || !position || !gwslug) {
            return new Response(JSON.stringify({ error: 'Missing parameters' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await gqlFetch(GET_GAMEWEEK_SCORES, { slugs, gwslug, position });

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
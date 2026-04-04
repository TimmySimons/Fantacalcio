import { gqlFetch } from '../_shared/sorare-client.ts';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const GET_GAMEWEEK_GAMES = `
    query GetGameweekGames($slug: String!, $fromDate: ISO8601DateTime!, $toDate: ISO8601DateTime!) {
        so5 {
            so5Fixture(slug: $slug) {
                games(fromDate: $fromDate, toDate: $toDate) {
                    date
                    statusTyped
                    competition { slug }
                    homeTeam { shortName code pictureUrl }
                    awayTeam { shortName code pictureUrl }
                    homeScore
                    awayScore
                }
            }
        }
    }
`;

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
        const { slug, fromDate, toDate } = await req.json();

        if (!slug || !fromDate || !toDate) {
            return new Response(JSON.stringify({ error: 'Missing parameters' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const data = await gqlFetch(GET_GAMEWEEK_GAMES, { slug, fromDate, toDate });

        return new Response(JSON.stringify({ data }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});

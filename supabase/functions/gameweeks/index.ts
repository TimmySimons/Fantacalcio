import { gqlFetch } from '../_shared/sorare-client.ts';
import { corsHeaders } from '../_shared/cors.ts';

const GET_GAMEWEEKS = `
    query GetGameweeks {
        so5 {
            allSo5Fixtures(eventType: CLASSIC, sport: FOOTBALL) {
                edges {
                    node {
                        seasonGameWeek
                        startDate
                        endDate
                        slug
                    }
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
        const data = await gqlFetch(GET_GAMEWEEKS);

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
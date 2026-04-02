import { gqlFetch } from '../_shared/sorare-client.ts';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GET_PLAYERS_AWAY_TEAMS = `
    query GetPlayersAwayTeams($playerSlugs: [String!]!, $gameweekSlug: String!) {
        football {
            players(slugs: $playerSlugs) {
                slug
                activeClub {
                    name
                }
                anyGamesForFixture(so5FixtureSlug: $gameweekSlug) {
                    awayTeam {
                        name
                    }
                    homeTeam {
                        name
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
        const { playerSlugs, gameweekSlug } = await req.json();

        if (!playerSlugs || !gameweekSlug) {
            return new Response(JSON.stringify({ error: 'Missing parameters' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const data = await gqlFetch(GET_PLAYERS_AWAY_TEAMS, { playerSlugs, gameweekSlug });

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
import { gqlFetch } from '../_shared/sorare-client.ts';

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GET_PLAYER = `
    query GetPlayer($slug: String!) {
        football {
            player(slug: $slug) {
                displayName
                abbreviatedName
                firstName
                lastName
                position
                shirtNumber
                birthDate
                height
                weight
                country {
                    name
                    flagUrl
                }
                activeClub {
                    name
                    pictureUrl
                    shortName
                }
                squaredPictureUrl
                so5Scores(last: 5) {
                    score
                    decisiveScore {
                        totalScore
                    }
                    game {
                        date
                        homeTeam {
                            name
                        }
                        awayTeam {
                            name
                            shortName
                        }
                    }
                }
                futureGames(first: 5) {
                    edges {
                        node {
                            date
                            awayTeam {
                                shortName
                            }
                        }
                    }
                }
                lastFiveSo5Appearances
            }
        }
    }
`;

Deno.serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    try {
        const { slug } = await req.json();

        if (!slug) {
            return new Response(JSON.stringify({ error: 'Missing slug parameter' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const data = await gqlFetch(GET_PLAYER, { slug });

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
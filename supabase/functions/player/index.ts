import { gqlFetch } from '../_shared/sorare-client.ts';

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
    try {
        const { slug } = await req.json();

        if (!slug) {
            return new Response(JSON.stringify({ error: 'Missing slug parameter' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await gqlFetch(GET_PLAYER, { slug });

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
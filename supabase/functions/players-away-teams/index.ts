import { gqlFetch } from '../_shared/sorare-client.ts';

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
    try {
        const { playerSlugs, gameweekSlug } = await req.json();

        if (!playerSlugs || !gameweekSlug) {
            return new Response(JSON.stringify({ error: 'Missing parameters' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const data = await gqlFetch(GET_PLAYERS_AWAY_TEAMS, { playerSlugs, gameweekSlug });

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
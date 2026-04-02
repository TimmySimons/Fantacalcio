import { gqlFetch } from '../_shared/sorare-client.ts';

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

Deno.serve(async () => {
    try {
        const data = await gqlFetch(GET_GAMEWEEKS);

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
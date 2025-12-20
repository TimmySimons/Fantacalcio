Deno.serve(async () => {
    try {
        const query = `
            {
              so5 {
                allSo5Fixtures(eventType:CLASSIC, sport: FOOTBALL) {
                    edges {
                        node {
                            seasonGameWeek,
                            startDate,
                            endDate,
                            slug
                        }
                    }
                }
              }
            }
        `;

        const response = await fetch('https://api.sorare.com/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const data = await response.json();

        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
});

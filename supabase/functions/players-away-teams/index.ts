Deno.serve(async (req) => {
    try {
        const url = new URL(req.url);
        const playerSlugs = url.searchParams.get('playerSlugs');
        const gameweekSlug = url.searchParams.get('gameweekSlug');

        if (!playerSlugs || !gameweekSlug) {
            return new Response(JSON.stringify({ error: 'Missing parameters' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const query = `
            {
                football {
                    players(slugs: [${playerSlugs
                        .split(',')
                        .map((s) => `"${s}"`)
                        .join(', ')}]) {
                        slug
                        activeClub {  name  }
                        anyGamesForFixture(so5FixtureSlug: "${gameweekSlug}") {
                            awayTeam  {
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

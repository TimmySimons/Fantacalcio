Deno.serve(async (req) => {
    try {
        const url = new URL(req.url);
        const slugs = url.searchParams.get('slugs');
        const position = url.searchParams.get('position');
        const gwslug = url.searchParams.get('gwslug');

        if (!slugs || !position || !gwslug) {
            return new Response(JSON.stringify({ error: 'Missing parameters' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const query = `
      {
        football {
          players(slugs: [${slugs
              .split(',')
              .map((s) => `"${s.trim()}"`)
              .join(', ')}]) {
            slug
            anyGameStats(so5FixtureSlug: "${gwslug}", last: 1) {
              playerGameScore(position: "${position}") {
                position
                score
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

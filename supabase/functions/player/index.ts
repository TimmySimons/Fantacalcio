Deno.serve(async (req) => {
    try {
        const url = new URL(req.url);
        const slug = url.searchParams.get('slug');

        if (!slug) {
            return new Response(JSON.stringify({ error: 'Missing slug parameter' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const query = `
      {
        football {
          player(slug: "${slug}") {
            displayName
            abbreviatedName
            firstName
            lastName
            position
            shirtNumber
            birthDate
            height
            weight
            country { name flagUrl }
            activeClub {  name pictureUrl shortName  }
            squaredPictureUrl
            so5Scores(last: 5) {
              score
              decisiveScore { totalScore }
              game {
                date
                homeTeam { name }
                awayTeam { name shortName }
              }
            }
            futureGames(first: 5) {
              edges {
                node {
                  date
                  awayTeam { shortName}
                }
              }
            }
            lastFiveSo5Appearances
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

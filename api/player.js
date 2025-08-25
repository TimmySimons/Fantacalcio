export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://timmysimons.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { slug } = req.query;

    if (!slug) {
        return res.status(400).json({ error: 'Missing slug parameter' });
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
              #allAverageStats(limit: LAST_5) {
              #  value
              #}
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
    res.status(200).json(data);
}

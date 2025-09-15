export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://timmysimons.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { slugs, position, gwslug } = req.query;

    if (!slugs || !position || !gwslug) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    const query = `
        {
          football {
            players(slugs: [${slugs
                .split(',')
                .map((s) => `"${s}"`)
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
    res.status(200).json(data);
}

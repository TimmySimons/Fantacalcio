export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://timmysimons.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { playerSlugs, gameweekSlug } = req.query;

    if (!playerSlugs || !gameweekSlug) {
        return res.status(400).json({ error: 'Missing slug parameter' });
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
    res.status(200).json(data);
}

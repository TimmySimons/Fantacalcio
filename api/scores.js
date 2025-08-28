export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://timmysimons.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { slugs } = req.query;

    if (!slugs) {
        return res.status(400).json({ error: 'Missing slugs parameter' });
    }

    const query = `
        {
          football {
            players(slugs: [${slugs
                .split(',')
                .map((s) => `"${s}"`)
                .join(', ')}]) {
              slug
              lastFiveSo5Appearances
              lastFifteenSo5Appearances
              lastFortySo5Appearances,
              average5: averageScore(type: LAST_FIVE_SO5_AVERAGE_SCORE),
              decisiveAverage5: averageScore(type: LAST_FIVE_AVERAGE_DECISIVE_SCORE),
              allAroundAverage5: averageScore(type: LAST_FIVE_AVERAGE_ALL_AROUND_SCORE),
              average15: averageScore(type: LAST_FIFTEEN_SO5_AVERAGE_SCORE),
              decisiveAverage15: averageScore(type: LAST_FIFTEEN_AVERAGE_DECISIVE_SCORE),
              allAroundAverage15: averageScore(type: LAST_FIFTEEN_AVERAGE_ALL_AROUND_SCORE),
              average40: averageScore(type: LAST_FORTY_SO5_AVERAGE_SCORE),
              decisiveAverage40: averageScore(type: LAST_FORTY_AVERAGE_DECISIVE_SCORE),
              allAroundAverage40: averageScore(type: LAST_FORTY_AVERAGE_ALL_AROUND_SCORE),
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

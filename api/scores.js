export default async function handler(req, res) {
    const { slugs } = req.query;

    if (!slugs) {
        return res.status(400).json({ error: 'Missing slugs parameter' });
    }

    const query = `
        {
          football {
            
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

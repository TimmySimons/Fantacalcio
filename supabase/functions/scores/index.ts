Deno.serve(async (req) => {
  try {
    const url = new URL(req.url)
    const slugs = url.searchParams.get('slugs')

    if (!slugs) {
      return new Response(JSON.stringify({ error: 'Missing slugs parameter' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const query = `
      {
        football {
          players(slugs: [${slugs
            .split(',')
            .map((s) => `"${s.trim()}"`)
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
    `

    const response = await fetch('https://api.sorare.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})

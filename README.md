# Vue 3 + TypeScript + Vite

## Local dev

Run `vercel dev`
Run `npm run dev`


### sorare api: get gameweeks
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

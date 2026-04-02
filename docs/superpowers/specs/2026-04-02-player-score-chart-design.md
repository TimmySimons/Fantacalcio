# Player Score Chart Widget — Design Spec

**Date:** 2026-04-02
**Status:** Approved

## Overview

Add a new widget to `StatsPage.vue` that shows per-gameweek scores for a single selected player. A dropdown at the top lets the user pick any of the manager's players; the chart below updates to show that player's scores across the last 10 published gameweeks.

## Component

**New file:** `src/components/stats/StatsPlayerScoreChart.vue`

A purely presentational component. Receives all data as props; emits selection changes upward.

### Props
| Prop | Type | Description |
|------|------|-------------|
| `players` | `{ id: string; name: string }[]` | All manager players for the dropdown |
| `selectedId` | `string` | Currently selected player ID (v-model compatible) |
| `data` | `{ week: number; score: number }[]` | Gameweek scores for the selected player |

### Emits
| Event | Payload | Description |
|-------|---------|-------------|
| `update:selectedId` | `string` | Fired when user selects a different player |

### Template structure
1. Card wrapper (matches existing stats card style)
2. Dropdown (`<select>`) at the top — lists all players by name, bound to `selectedId`
3. Chart.js bar chart below the dropdown

### Chart details
- Uses Chart.js (already a project dependency via `StatsScoreChart`)
- `backgroundColor` is an array: one color per bar, each derived from `FootballUtil.getColorByValue(score)`
- X-axis labels: `GW{week}` (e.g. `GW12`)
- Y-axis: numeric score, starts at 0
- Rebuilds (destroys + recreates) when `data` prop changes via `watch`

## StatsPage changes

### New state
```ts
const selectedPlayerId = ref<string>('');
```
Defaults to empty string; set to `allPlayers.value[0]?.player.id` once `allPlayers` loads (watch).

### New computed: `playerChartData`
```ts
// For each of the last 10 published gameweeks (sorted by week asc),
// find the selected player in userGameWeeksTeamPlayers.
// If found, use their score (rounded); if not found, use 0.
// Return { week: number; score: number }[]
```

### Template addition
After `<StatsGameweekExtremes>`:
```html
<StatsPlayerScoreChart
  :players="playerDropdownList"
  v-model:selectedId="selectedPlayerId"
  :data="playerChartData"
/>
```

### New computed: `playerDropdownList`
Maps `allPlayers` to `{ id: string; name: string }[]` using `player.first_name + ' ' + player.last_name`.

## Data flow

```
userGameWeeksTeamPlayers (store)
gameweeks (store)
allPlayers (ref)
        │
        ▼
selectedPlayerId (ref, StatsPage)
        │
        ▼
playerChartData (computed, StatsPage)
        │
        ▼
StatsPlayerScoreChart (props: players, selectedId, data)
        │
        ▼
Chart.js bar chart + select dropdown
```

## API change: `getUserGameweeksTeamPlayers`

The current query selects `TeamPlayers(id, score)` — `id` here is the TeamPlayers record ID, not the player ID. To match scores per player, extend the select to `TeamPlayers(id, player_id, score)` and update `GameweekTeamPlayerContract` accordingly:

```ts
TeamPlayers: { id: string; player_id: string; score: number | null }[]
```

## Gameweek score lookup

For each of the last 10 published gameweeks:
1. Find the entry in `userGameWeeksTeamPlayers` where `gameweek_id === gw.id`
2. Find the player in `entry.TeamPlayers` where `tp.player_id === selectedPlayerId`
3. Use `Math.round(tp.score ?? 0)`, or `0` if no entry/player found

## Styling

Matches existing stats card style (white background, rounded corners, padding, gap). Dropdown styled inline to fit the card header. No new design tokens needed.

## Out of scope

- Player avatars in the dropdown
- Hover tooltips on bars (Chart.js default tooltips are sufficient)
- Caching or API changes (all data already available in existing store state)

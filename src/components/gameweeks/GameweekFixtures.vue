<script setup lang="ts">
import { computed, ref } from 'vue';
import type { GameweekContract } from '../../model/gameweek.contract.ts';
import { SorareApi } from '../../sorare/sorare.api.ts';
import { GameweekApi } from '../../supabase/football/gameweek.api.ts';

const props = defineProps<{ gameweek: GameweekContract | undefined }>();

const GAMES_STALE_MS = 60 * 60 * 1000;

const gameweekGames = ref<Awaited<ReturnType<typeof GameweekApi.getGameweekGames>>>([]);
const showFixtures = ref(false);
const fixturesLoading = ref(false);

const sortedGameweekGames = computed(() =>
    [...gameweekGames.value].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
);

const showFixturesButton = computed(() => {
    if (!props.gameweek) return false;
    return new Date(props.gameweek.start_date).getTime() < Date.now();
});

async function loadGameweekGames(gw: GameweekContract) {
    const cached = await GameweekApi.getGameweekGames(gw.id);
    const now = Date.now();
    const started = new Date(gw.start_date).getTime() < now;
    const ended = new Date(gw.end_date).getTime() < now;

    if (cached.length > 0) {
        if (!started || ended) {
            gameweekGames.value = cached;
            return;
        }
        const lastUpdated = Math.max(...cached.map((g) => new Date(g.updated_at).getTime()));
        if (now - lastUpdated < GAMES_STALE_MS) {
            gameweekGames.value = cached;
            return;
        }
    }

    const games = await SorareApi.getGameweekGames(
        gw.sorare_slug,
        new Date(gw.start_date).toISOString().split('T')[0],
        new Date(gw.end_date).toISOString().split('T')[0]
    );
    await GameweekApi.saveGameweekGames(gw.id, games);
    gameweekGames.value = await GameweekApi.getGameweekGames(gw.id);
}

const onOpen = async () => {
    if (!props.gameweek) return;
    showFixtures.value = true;
    fixturesLoading.value = true;
    await loadGameweekGames(props.gameweek);
    fixturesLoading.value = false;
};

defineExpose({ open: onOpen });
</script>

<template>
    <div v-if="showFixturesButton" class="fixtures-btn-row">
        <Button label="Fixtures" @click="onOpen" class="fixtures-btn" />
    </div>

    <Dialog
        v-model:visible="showFixtures"
        modal
        :style="{ width: '90vw', maxWidth: '480px', height: '90vh' }"
        :pt="{
            content: { style: 'flex: 1; overflow-y: auto; display: flex; flex-direction: column;' }
        }"
    >
        <template #header>
            <div class="fixtures-header">
                <span class="gw-pill">GW{{ gameweek?.week }}</span>
                <span>Fixtures</span>
            </div>
        </template>
        <div v-if="fixturesLoading" class="fixtures-loading">
            <i class="pi pi-spin pi-spinner" style="font-size: 24px"></i>
        </div>
        <div v-else-if="sortedGameweekGames.length === 0" class="fixtures-empty">
            No fixtures available
        </div>
        <div v-else class="fixtures-list">
            <div v-for="game in sortedGameweekGames" :key="game.id" class="fixture-card">
                <div class="team">
                    <img :src="game.home_team_picture_url" :alt="game.home_team_code" />
                    <span class="team-name">{{ game.home_team_name }}</span>
                </div>
                <div class="fixture-score">
                    <template
                        v-if="game.status_typed === 'playing' || game.status_typed === 'played'"
                    >
                        <span class="scoreline">{{ game.home_score }} – {{ game.away_score }}</span>
                    </template>
                    <template v-else>
                        <span class="scoreline">-</span>
                    </template>
                    <span class="fixture-date">{{
                        new Date(game.date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short'
                        })
                    }}</span>
                    <span v-if="game.status_typed === 'scheduled'" class="fixture-time">{{
                        new Date(game.date).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })
                    }}</span>
                </div>
                <div class="team">
                    <img :src="game.away_team_picture_url" :alt="game.away_team_code" />
                    <span class="team-name">{{ game.away_team_name }}</span>
                </div>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.fixtures-btn-row {
    padding: 4px 0 0;
}

:deep(.fixtures-btn) {
    width: 100%;
    background: #fff;
    color: darkred;
    font-weight: 500;
    box-shadow: 0px 3px 6px 0px rgb(0 0 0 / 8%);
    border: 1px solid #e8e8e8;

    &:hover,
    &:active {
        background: #fff !important;
        border-color: transparent !important;
        color: darkred !important;
    }
}

.fixtures-header {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1em;
    font-weight: 600;
}

.gw-pill {
    background: darkred;
    color: #fff;
    font-size: 0.75em;
    font-weight: 700;
    padding: 2px 10px;
    border-radius: 20px;
}

.fixtures-loading,
.fixtures-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.fixtures-empty {
    color: #aaa;
    font-size: 0.85em;
}

.fixtures-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.fixture-card {
    border-radius: 12px;
    background: #fafafa;
    border: 1px solid #efefef;
    padding: 12px 14px;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 8px;

    .team {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        img {
            width: 40px;
            height: 40px;
            object-fit: contain;
        }
    }

    .team-name {
        font-size: 0.6em;
        color: #494949;
        text-align: center;
    }

    .fixture-score {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        min-width: 64px;

        .scoreline {
            font-size: 1.1em;
            font-weight: 700;
            color: #222;
        }

        .fixture-date {
            font-size: 0.65em;
            color: #999;
        }

        .fixture-time {
            font-size: 0.65em;
            color: #bbb;
        }
    }
}
</style>

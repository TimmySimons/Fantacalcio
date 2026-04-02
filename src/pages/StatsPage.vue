<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth.store.ts';
import { useFootballStore } from '../stores/football.store.ts';
import { useFootballScoreStore } from '../stores/football-scores.store.ts';
import { FootballApi } from '../supabase/football.api.ts';
import type { BasePlayerContract } from '../model/player.contract.ts';
import StatsPlayerCard from '../components/stats/StatsPlayerCard.vue';
import StatsScoreChart from '../components/stats/StatsScoreChart.vue';
import StatsGameweekExtremes from '../components/stats/StatsGameweekExtremes.vue';
import StatsPlayerScoreChart from '../components/stats/StatsPlayerScoreChart.vue';
import { Util } from '../util.ts';

const route = useRoute();
const router = useRouter();

const authStore = useAuthStore();
const { appUser } = storeToRefs(authStore);

const footballStore = useFootballStore();
const { managers, gameweeks } = storeToRefs(footballStore);
const footballScoreStore = useFootballScoreStore();
const { userGameWeeksTeamPlayers } = storeToRefs(footballScoreStore);

footballStore.getManagers();
footballStore.getAllGameweeks();
footballScoreStore.getAllUsersGameweeksTeamPlayers();

const routeManagerId = computed(() => route.params.id as string | undefined);
const isOwnStats = computed(() => !routeManagerId.value);

const targetUserId = computed(() => routeManagerId.value ?? appUser.value?.id ?? '');

const targetManager = computed(() => managers.value?.find((m) => m.id === targetUserId.value));

const teamName = computed(() =>
    isOwnStats.value ? appUser.value?.team_name : targetManager.value?.team_name
);

const allPlayers = ref<
    { player: BasePlayerContract & { picture_url?: string }; totalScore: number }[]
>([]);
const loading = ref(true);

async function loadData(userId: string) {
    loading.value = true;
    footballScoreStore.getUserGameweeksTeamPlayers(userId);
    try {
        allPlayers.value = await FootballApi.getTopPlayersByUser(userId);
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    if (targetUserId.value) loadData(targetUserId.value);
});

watch(targetUserId, (id) => {
    if (id) loadData(id);
});

const bestPlayers = computed(() => allPlayers.value.slice(0, 3));
const worstPlayers = computed(() => allPlayers.value.slice(-3).reverse());

const selectedPlayerId = ref<string>('');

watch(allPlayers, (players) => {
    if (
        players.length > 0 &&
        !players.some((p) => p.player.id === selectedPlayerId.value)
    ) {
        selectedPlayerId.value = players[0].player.id;
    }
});

const playerDropdownList = computed(() =>
    allPlayers.value.map((p) => ({
        id: p.player.id,
        name: `${p.player.first_name}${p.player.last_name ? ' ' + p.player.last_name : ''}`,
        picture_url: p.player.picture_url,
        club_name_short: p.player.club_name_short,
        position: p.player.position
    }))
);

const selectedPlayerTotalScore = computed(
    () => allPlayers.value.find((p) => p.player.id === selectedPlayerId.value)?.totalScore
);

const playerChartData = computed(() => {
    const userTeams = userGameWeeksTeamPlayers.value ?? [];
    return (gameweeks.value ?? [])
        .filter((gw) => !!gw.scores_published_date)
        .sort((a, b) => a.week - b.week)
        .slice(-10)
        .map((gw) => {
            const team = userTeams.find((t) => t.gameweek_id === gw.id);
            const tp = team?.TeamPlayers.find(
                (p) => p.player_id === selectedPlayerId.value
            );
            return { week: gw.week, score: Math.round(tp?.score ?? 0) };
        });
});

const rankedManagers = computed(() =>
    (managers.value ?? [])
        .filter((m) => !m.roles.includes('SUPER_ADMIN'))
        .map((m) => ({ id: m.id, totalScore: footballScoreStore.totalUserScore(m.id) }))
        .sort((a, b) => b.totalScore - a.totalScore)
);

const userRank = computed(() => {
    const idx = rankedManagers.value.findIndex((m) => m.id === targetUserId.value);
    return idx === -1 ? '—' : String(idx + 1);
});

const userTotalScore = computed(() =>
    Util.formatNumberWithDot(footballScoreStore.totalUserScore(targetUserId.value))
);

const allGameweekScores = computed(() => {
    const userTeams = userGameWeeksTeamPlayers.value ?? [];

    return (gameweeks.value ?? [])
        .filter((gw) => !!gw.scores_published_date)
        .sort((a, b) => a.week - b.week)
        .map((gw) => {
            const team = userTeams.find((t) => t.gameweek_id === gw.id);
            const score = team
                ? Math.round(team.TeamPlayers.reduce((acc, tp) => acc + (tp.score ?? 0), 0))
                : 0;
            return { week: gw.week, score };
        });
});

const gameweekScores = computed(() => allGameweekScores.value.slice(-10));

const bestGameweek = computed(() =>
    allGameweekScores.value.reduce<{ week: number; score: number } | null>(
        (best, gw) => (!best || gw.score > best.score ? gw : best),
        null
    )
);

const worstGameweek = computed(() =>
    allGameweekScores.value.reduce<{ week: number; score: number } | null>(
        (worst, gw) => (!worst || gw.score < worst.score ? gw : worst),
        null
    )
);
</script>

<template>
    <div class="stats-page">
        <div class="page-header">
            <button v-if="!isOwnStats" class="back-btn" @click="router.back()">
                <i class="pi pi-arrow-circle-left" style="font-size: 1.6rem" />
            </button>
            <span class="stats-label">Stats</span>
            <span class="team-name">{{ teamName }}</span>
        </div>

        <div class="summary-row">
            <div class="summary-card dark-red">
                <div class="summary-label">Rank</div>
                <div class="summary-value">#{{ userRank }}</div>
            </div>
            <div class="summary-card black">
                <div class="summary-label">Total Points</div>
                <div class="summary-value">{{ userTotalScore }}</div>
            </div>
        </div>

        <StatsPlayerCard title="Best Players" :players="bestPlayers" :loading="loading" />
        <StatsPlayerCard title="Worst Players" :players="worstPlayers" :loading="loading" />
        <StatsScoreChart :data="gameweekScores" />
        <StatsGameweekExtremes :best="bestGameweek" :worst="worstGameweek" />
        <StatsPlayerScoreChart
            :players="playerDropdownList"
            v-model:selectedId="selectedPlayerId"
            :data="playerChartData"
            :totalScore="selectedPlayerTotalScore"
        />
    </div>
</template>

<style scoped>
.stats-page {
    flex: 1;
    background-color: #f3f3f3;
    padding: 24px 18px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    overflow-y: auto;
}

.page-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-right: 8px;
}

.back-btn {
    background: none;
    border: none;
    padding: 0;
    margin-right: 4px;
    cursor: pointer;
    color: #7e7e7e;
    display: flex;
    align-items: center;
}

.stats-label {
    font-size: 0.7em;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #fff;
    background: darkred;
    padding: 3px 8px;
    border-radius: 6px;
}

.team-name {
    font-size: 0.95em;
    font-weight: 600;
    color: #333;
}

.summary-row {
    display: flex;
    gap: 12px;
}

.summary-card {
    flex: 1;
    border-radius: 16px;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 4px;

    &.dark-red {
        background-color: #7c1e1e;
    }

    &.black {
        background-color: #111111;
    }
}

.summary-label {
    font-size: 0.75em;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.summary-value {
    font-size: 1.6em;
    font-weight: bold;
    color: #ffffff;
}
</style>

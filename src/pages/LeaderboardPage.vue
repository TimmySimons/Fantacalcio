<script setup lang="ts">
import LeaderboardStage from '../components/leader-board/LeaderboardStage.vue';
import LeaderboardListItem from '../components/leader-board/LeaderboardListItem.vue';
import type { ManagerContract } from '../model/manager.contract.ts';
import { computed, onMounted, ref } from 'vue';
import { ScreenSizeUtil } from '../size.ts';
import { useFootballScoreStore } from '../stores/football-scores.store.ts';
import { useFootballStore } from '../stores/football.store.ts';
import { storeToRefs } from 'pinia';
import Select from 'primevue/select';
import { SeasonUtil } from '../SeasonUtil.ts';

onMounted(() => {
    ScreenSizeUtil.setViewportHeight();
});

const footballStore = useFootballStore();
const { managers, gameweeks } = storeToRefs(footballStore);
footballStore.getManagers();
footballStore.getAllGameweeks().then(() => {
    if (footballStore.currentGameweek) {
        footballStore.getGameweek(footballStore.currentGameweek.id);
        footballScoreStore.getUsersGameweekScores(footballStore.currentGameweek.id);
    }
});
const footballScoreStore = useFootballScoreStore();
footballScoreStore.getAllUsersGameweeksTeamPlayers();

const selectedSeason = ref(SeasonUtil.getCurrentSeason());
const availableSeasons = computed(() =>
    SeasonUtil.getSeasonsFromDates(gameweeks.value?.map((gw) => gw.start_date) ?? [])
);

const managersWithScores = computed<ManagerContract[]>(() => {
    const visibleManagers = managers.value?.filter((m) => !m.roles.includes('SUPER_ADMIN'));
    return (
        visibleManagers
            ?.map((m) => ({
                ...m,
                totalScore: useFootballScoreStore().totalUserScore(m.id, selectedSeason.value) ?? 0,
                lastGameweekScore: 0
            }))
            .sort((a, b) => b.totalScore - a.totalScore) ?? []
    );
});

const topThree = computed<(ManagerContract | undefined)[]>(() => {
    const validWinners = managersWithScores.value;
    return [validWinners[1], validWinners[0], validWinners[2]];
});
</script>

<template>
    <div class="page-content">
        <div class="header-row">
            <Select
                v-model="selectedSeason"
                :options="availableSeasons"
                option-label="label"
                data-key="label"
                size="small"
                variant="text"
            />
        </div>

        <LeaderboardStage :top-three="topThree" />

        <div class="list">
            <LeaderboardListItem
                v-for="(manager, idx) in managersWithScores"
                :key="manager.id"
                :place="idx + 1"
                :manager="manager"
                :season="selectedSeason"
            />
        </div>
    </div>
</template>

<style scoped>
.page-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #470000;

    .header-row {
        position: absolute;
        top: 10px;
        right: 2px;
        z-index: 100;

        :deep(.p-select-label) {
            color: rgba(255, 255, 255, 0.33);
            padding: 0;
        }

        :deep(.p-select-dropdown) {
            width: 32px;
        }

        :deep(.p-select-dropdown-icon) {
            color: rgba(255, 255, 255, 0.33);
        }
    }

    :deep(.p-select) {
        background: transparent !important;
        border: none;
        box-shadow: none;
        color: white;
    }

    .list {
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1;
        background-color: #f3f3f3;
        padding: 24px 18px;
        border-radius: 24px 24px 0 0;
        position: relative;
        z-index: 10;
    }
}
</style>

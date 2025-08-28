<script setup lang="ts">
import LeaderboardStage from '../components/leader-board/LeaderboardStage.vue';
import LeaderboardListItem from '../components/leader-board/LeaderboardListItem.vue';
import type { ManagerContract } from '../model/manager.contract.ts';
import { computed, onMounted } from 'vue';
import { ScreenSizeUtil } from '../size.ts';
import { useFootballScoreStore } from '../stores/football-scores.store.ts';
import { useFootballStore } from '../stores/football.store.ts';
import { storeToRefs } from 'pinia';

onMounted(() => {
    ScreenSizeUtil.setViewportHeight();
});

const footballStore = useFootballStore();
const { managers } = storeToRefs(footballStore);
footballStore.getManagers();
const footballScoreStore = useFootballScoreStore();
footballScoreStore.getAllUsersGameweeksTeamPlayers();

const managersWithScores = computed<ManagerContract[]>(() => {
    return (
        managers.value
            ?.map((m) => ({
                ...m,
                totalScore: useFootballScoreStore().totalUserScore(m.id) ?? 0,
                lastGameweekScore: 0
            }))
            .sort((a, b) => b.totalScore - a.totalScore) ?? []
    );
});

const topThree = computed<(ManagerContract | undefined)[]>(() => {
    return [managersWithScores.value[1], managersWithScores.value[0], managersWithScores.value[2]];
});
</script>

<template>
    <div class="page-content">
        <LeaderboardStage :top-three="topThree" />

        <div class="list">
            <LeaderboardListItem
                v-for="(manager, idx) in managersWithScores"
                :key="manager.id"
                :place="idx + 1"
                :manager="manager"
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

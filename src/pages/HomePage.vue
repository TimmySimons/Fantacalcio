<script setup lang="ts">
import LeaderboardStage from '../components/leader-board/LeaderboardStage.vue';
import LeaderboardListItem from '../components/leader-board/LeaderboardListItem.vue';
import type { ManagerContract } from '../model/manager.contract.ts';
import { computed, onMounted } from 'vue';
import { ScreenSizeUtil } from '../size.ts';

onMounted(() => {
    ScreenSizeUtil.setViewportHeight();
});

const managers: ManagerContract[] = [
    {
        id: '001',
        teamName: 'Team A',
        managerName: 'Manager A',
        gameweekScore: 33,
        totalScore: 123
    },
    {
        id: '002',
        teamName: 'Team B',
        managerName: 'Manager B',
        gameweekScore: 43,
        totalScore: 133
    },
    {
        id: '003',
        teamName: 'Team C',
        managerName: 'Manager C',
        gameweekScore: 53,
        totalScore: 146
    },
    {
        id: '004',
        teamName: 'Team D',
        managerName: 'Manager D',
        gameweekScore: 63,
        totalScore: 175
    },
    {
        id: '005',
        teamName: 'Team E',
        managerName: 'Manager E',
        gameweekScore: 73,
        totalScore: 188
    },
    {
        id: '006',
        teamName: 'Team F',
        managerName: 'Manager F',
        gameweekScore: 76,
        totalScore: 192
    }
];

const topThree = computed<ManagerContract[]>(() => {
    const sorted = managers.sort((a, b) => b.totalScore - a.totalScore).slice(0, 3);

    return [sorted[1], sorted[0], sorted[2]];
});
</script>

<template>
    <div class="page-content">
        <LeaderboardStage :top-three="topThree" />

        <div class="list">
            <LeaderboardListItem
                v-for="(manager, idx) in managers"
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

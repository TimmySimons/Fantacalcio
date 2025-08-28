<script setup lang="ts">
import { useFootballStore } from '../../stores/football.store.ts';
import { storeToRefs } from 'pinia';
import { useFootballScoreStore } from '../../stores/football-scores.store.ts';
import { computed, watch } from 'vue';

const props = defineProps<{
    managerId: string;
}>();

const footballStore = useFootballStore();
const { gameweek } = storeToRefs(footballStore);
const footballScoreStore = useFootballScoreStore();

watch(gameweek, () => {
    if (gameweek.value) {
        footballStore.getGameweekTeam(gameweek.value.id, props.managerId);
        footballScoreStore.getUserGameweeksTeamPlayers(props.managerId);
    }
});

const totalScore = computed(() => {
    return footballScoreStore.totalUserScore(props.managerId);
});

const gameweekScore = computed(() => {
    return gameweek.value ? footballScoreStore.gameweekUserScore(gameweek.value.id) : 0;
});
</script>

<template>
    <div class="scores">
        <div class="score gw-score">+{{ gameweekScore }}</div>
        <div class="score total-score">{{ totalScore }}</div>
    </div>
</template>

<style scoped>
.scores {
    display: flex;
    justify-content: flex-end;
    font-size: 12px;
    font-weight: bold;

    .score {
        padding: 2px 8px;
        min-width: 40px;
        text-align: center;
    }

    .gw-score {
        background-color: #dcdcdc;
        border-radius: 8px 0 0 8px;
    }
    .total-score {
        background-color: #570000;
        color: white;
        border-radius: 0 8px 8px 0;
    }
}
</style>

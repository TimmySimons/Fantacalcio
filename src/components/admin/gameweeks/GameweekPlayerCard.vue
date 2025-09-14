<script setup lang="ts">
import type { BasePlayerContract } from '../../../model/player.contract.ts';
import { computed } from 'vue';
import { FootballUtil } from '../../../FootballUtil.ts';

const props = defineProps<{
    player: BasePlayerContract;
    score?: number;
}>();

const color = computed(() => {
    return props.score ? FootballUtil.getColorByValue(props.score) : undefined;
});
</script>

<template>
    <Card class="card player flex">
        <template #content>
            <div class="card-content">
                <div>
                    <div class="name">{{ player.first_name }} {{ player.last_name }}</div>
                    <div class="sub">{{ player.club_name_short }}</div>
                </div>
                <div class="score" :style="{ color: color, borderColor: color }">
                    {{ score ? Math.round(score) : '' }}
                </div>
            </div></template
        ></Card
    >
</template>

<style scoped>
.card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.player {
    min-height: fit-content;
    font-size: 0.8em;
}

.name {
    font-weight: bold;
}

.sub {
    color: #555555;
}

.score {
    height: 38px;
    width: 38px;
    border-radius: 53% / 25%;
    border: 1px solid #f0f0f0;
    color: #f0f0f0;
    font-size: 14px;
    justify-content: center;
    display: flex;
    align-items: center;
}
</style>

<script setup lang="ts">
import type { GameweekContract } from '../../model/gameweek.contract.ts';
import dayjs from 'dayjs';
import DateCountdown from '../DateCountdown.vue';
import GameweekSelector from './GameweekSelector.vue';

defineProps<{
    gameweek: GameweekContract | undefined;
    complete: boolean;
    isLocked: boolean;
}>();

const emit = defineEmits<{
    (e: 'click-week'): void;
}>();
</script>

<template>
    <div class="banner">
        <GameweekSelector
            :gameweek="gameweek"
            :complete="complete"
            :is-locked="isLocked"
            @click-week="emit('click-week')"
        />
        <div class="date" v-if="gameweek">
            <template v-if="new Date().getTime() > new Date(gameweek.start_date).getTime()">
                {{ dayjs(gameweek.start_date).format('DD MMM') }}
                -
                {{ dayjs(gameweek.end_date).format('DD MMM') }}
            </template>
            <DateCountdown v-else :target-date="new Date(gameweek.start_date)" />
        </div>
    </div>
</template>

<style scoped>
.banner {
    width: 100%;
    box-sizing: border-box;
    padding: 0 18px;
    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: center;
    color: white;
    height: 44px;
    position: relative;
    z-index: 30;

    .date {
        font-size: 0.6em;
        opacity: 0.5;
        font-weight: bold;
    }
}
</style>

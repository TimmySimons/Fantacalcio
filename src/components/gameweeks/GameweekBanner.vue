<script setup lang="ts">
import type { GameweekContract } from '../../model/gameweek.contract.ts';
import dayjs from 'dayjs';
import CheckIcon from '../../assets/icons/checkmark.svg';

defineProps<{
    gameweek: GameweekContract | undefined;
    complete: boolean;
}>();
</script>

<template>
    <div class="banner">
        <div class="week">
            <div>GW</div>
            <div>{{ gameweek?.week }}</div>
            <component v-if="complete" :is="CheckIcon" class="svg check" />
        </div>
        <div class="date" v-if="gameweek">
            {{ dayjs(gameweek.start_date).format('DD MMM') }}
            -
            {{ dayjs(gameweek.end_date).format('DD MMM') }}
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

    .week {
        border: 2px solid #f3f3f3;
        border-radius: 100%;
        min-width: 80px;
        min-height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #7c1e1e;
        font-weight: bold;
        font-size: large;
        position: absolute;
        top: 10px;
        left: 18px;

        > div:first-child {
            color: rgba(255, 255, 255, 0.72);
            font-weight: normal;
            margin-right: 2px;
        }
    }

    .date {
        font-size: 0.5em;
        opacity: 0.5;
    }

    .check {
        position: absolute;
        bottom: -10px;
        right: -10px;
        z-index: 20;
        height: 36px;
        width: 36px;
        fill: #009900;
    }
}
</style>

<script setup lang="ts">
import type { GameweekContract } from '../../model/gameweek.contract.ts';
import dayjs from 'dayjs';
import CheckIcon from '../../assets/icons/checkmark.svg';
import DateCountdown from '../DateCountdown.vue';

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
        <div class="week" @click="emit('click-week')">
            <div>GW</div>
            <div>{{ gameweek?.week }}</div>
            <!--            <component v-if="isLocked" :is="LockIcon" class="svg lock" />-->
            <component v-if="!isLocked && complete" :is="CheckIcon" class="svg check" />
        </div>
        <div class="date" v-if="gameweek">
            <template v-if="new Date().getTime() > new Date(gameweek.start_date).getTime()">
                {{ dayjs(gameweek.start_date).format('DD MMM') }}
                -
                {{ dayjs(gameweek.end_date).format('DD MMM') }}
            </template>
            <DateCountdown v-else :target-date="gameweek.start_date" />
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
        left: 14px;

        > div:first-child {
            color: rgba(255, 255, 255, 0.72);
            font-weight: normal;
            margin-right: 2px;
        }
    }

    .date {
        font-size: 0.6em;
        opacity: 0.5;
        font-weight: bold;
    }

    .svg {
        position: absolute;
        bottom: -10px;
        right: -10px;
        z-index: 20;
        height: 36px;
        width: 36px;

        &.check {
            fill: #009900;
        }

        &.lock {
            fill: #a4a4a4;
        }
    }
}
</style>

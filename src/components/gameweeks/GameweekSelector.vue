<script setup lang="ts">
import CheckIcon from '../../assets/icons/checkmark.svg';
import type { GameweekContract } from '../../model/gameweek.contract.ts';

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
    <div class="week" @click="emit('click-week')">
        <div v-if="gameweek">GW</div>
        <div>{{ gameweek?.week }}</div>
        <component v-if="!isLocked && complete" :is="CheckIcon" class="svg check" />
    </div>
</template>

<style scoped>
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
    color: white;

    > div:first-child {
        color: rgba(255, 255, 255, 0.72);
        font-weight: normal;
        margin-right: 2px;
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
    }
}
</style>

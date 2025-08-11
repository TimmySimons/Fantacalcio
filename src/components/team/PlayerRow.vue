<script setup lang="ts">
import { type PlayerContract } from '../../model/player.contract.ts';
import JerseyIcon from '../../assets/icons/jersey-full.svg';

defineProps<{
    group: string;
    players: PlayerContract[];
    isHidden?: boolean;
}>();
</script>

<template>
    <div class="position-group" :class="[group, { hidden: isHidden }]">
        <div v-for="player in players" :key="player.id" class="player">
            <component :is="JerseyIcon" class="svg" />
            <span class="name">{{ player.lastName }}</span>
        </div>
    </div>
</template>

<style scoped>
.position-group {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-evenly;

    &.hidden {
        opacity: 0;
    }
}

.player {
    display: flex;
    flex-direction: column;
    align-items: center;

    .svg {
        height: 46px;
        width: 46px;
        fill: #032539;
    }

    .name {
        font-size: 0.6em;
        font-weight: bold;
        text-align: center;
        line-height: 1.2em;
    }
}
</style>

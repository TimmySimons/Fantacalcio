<script setup lang="ts">
import { type PlayerContract } from '../../model/player.contract.ts';
import PlayerJersey from './PlayerJersey.vue';

defineProps<{
    group: string;
    players: PlayerContract[];
    isHidden?: boolean;
    selectedPlayer?: PlayerContract;
    includedPlayers?: PlayerContract[];
}>();

const emit = defineEmits<{
    (e: 'click', player: PlayerContract | undefined): void;
}>();
</script>

<template>
    <div class="position-group" :class="[group, { hidden: isHidden }]">
        <PlayerJersey
            v-for="player in players"
            :key="player.id"
            :player="player"
            :selected-player="selectedPlayer"
            :included-players="includedPlayers"
            @click="emit('click', $event)"
        />

        <div class="player hidden" v-if="players.length === 0"><span class="name"></span></div>
    </div>
</template>

<style scoped>
.position-group {
    display: flex;
    width: 100%;
    align-items: start;
    justify-content: space-evenly;

    .player {
        min-height: 58px;
        width: 58px;
    }

    &.hidden {
        opacity: 0;
    }
}

.grid .position-group {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 6px;
}
</style>

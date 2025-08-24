<script setup lang="ts">
import type { PlayerContract } from '../../model/player.contract.ts';

defineProps<{
    players: PlayerContract[];
    title: string;
}>();

const selectedPlayers = defineModel<string[]>({ required: false, default: [] });
</script>

<template>
    <div class="section">
        <div class="section-header">
            {{ title }} <span>({{ selectedPlayers.length }})</span>
        </div>
        <div class="flex col gap-4">
            <div v-for="player of players" :key="player.id" class="flex gap-8 items-center">
                <Checkbox
                    v-model="selectedPlayers"
                    :inputId="player.id"
                    name="player"
                    :value="player.id"
                />
                <label :for="player.id">{{ `${player.first_name} ${player.last_name}` }}</label>
            </div>
        </div>
    </div>
</template>

<style scoped>
.section-header {
    font-size: 1em;
    font-weight: bold;
    padding-bottom: 6px;
    margin-bottom: 12px;
    border-bottom: 1px solid #d8d8d8;
}
</style>

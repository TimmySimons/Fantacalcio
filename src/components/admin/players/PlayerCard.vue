<script setup lang="ts">
import type { PlayerContract } from '../../../model/player.contract.ts';
import SorareIcon from '../../../assets/icons/sorare.svg';

defineProps<{
    player: PlayerContract;
}>();
</script>

<template>
    <Card class="card player flex">
        <template #content>
            <div class="card-content">
                <div>
                    <div class="name">{{ player.first_name }} {{ player.last_name }}</div>
                    <div class="sub">{{ player.club_name_short }}</div>
                </div>
                <component
                    v-if="player.sorare_slug"
                    :is="SorareIcon"
                    class="svg sorare"
                /></div></template
    ></Card>
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
</style>

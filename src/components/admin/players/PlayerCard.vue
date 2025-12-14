<script setup lang="ts">
import type { PlayerContract } from '../../../model/player.contract.ts';

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
                <div
                    v-if="player.club_picture_url"
                    class="indicator"
                    :style="{ backgroundImage: `url(${player.club_picture_url})` }"
                ></div></div></template
    ></Card>
</template>

<style scoped>
.card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .indicator {
        width: 35px;
        height: 35px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    }
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

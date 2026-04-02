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
                <div class="avatar-wrapper">
                    <div
                        class="avatar"
                        :style="
                            player.picture_url
                                ? { backgroundImage: `url(${player.picture_url})` }
                                : {}
                        "
                    ></div>
                </div>
                <div>
                    <div class="name">
                        <span class="first-name">{{ player.first_name }}</span>
                        {{ player.last_name }}
                    </div>
                    <div class="sub">{{ player.club_name_short }}</div>
                </div>
            </div>
        </template>
    </Card>
</template>

<style scoped>
.card-content {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;

    .avatar-wrapper {
        flex-shrink: 0;
        padding: 6px 3px 0 3px;
        background-color: #f4f4f4;
        border-radius: 4px;
    }

    .avatar {
        width: 34px;
        height: 34px;
        background-repeat: no-repeat;
        background-position: center top;
        background-size: cover;
    }
}

.player {
    min-height: fit-content;
    font-size: 0.8em;
}

.name {
    font-weight: bold;
    color: darkred;

    .first-name {
        color: #000;
    }
}

.sub {
    color: #555555;
}
</style>

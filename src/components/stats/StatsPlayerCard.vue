<script setup lang="ts">
import type { BasePlayerContract } from '../../model/player.contract.ts';
import { Util } from '../../util.ts';

defineProps<{
    title: string;
    players: { player: BasePlayerContract & { picture_url?: string }; totalScore: number }[];
    loading: boolean;
}>();

const medalColors = ['goldenrod', '#808080', '#b16437'];
const positionColor: Record<string, string> = {
    Goalkeeper: '#f5a623',
    Defender: '#4a90d9',
    Midfielder: '#27ae60',
    Forward: '#e74c3c'
};
</script>

<template>
    <div class="card">
        <div class="card-title">{{ title }}</div>

        <div v-if="loading" class="empty">Loading…</div>
        <div v-else-if="players.length === 0" class="empty">No scores yet</div>

        <div v-else class="player-list">
            <div v-for="(entry, idx) in players" :key="entry.player.id" class="player-row">
                <div class="medal" :style="{ color: medalColors[idx] }">{{ idx + 1 }}</div>

                <div class="avatar-wrapper">
                    <img
                        v-if="entry.player.picture_url"
                        :src="entry.player.picture_url"
                        class="avatar"
                        :alt="entry.player.first_name"
                    />
                    <div v-else class="avatar-fallback">
                        {{ entry.player.first_name[0] }}{{ entry.player.last_name?.[0] ?? '' }}
                    </div>
                </div>

                <div class="info">
                    <div class="name">
                        {{ entry.player.first_name }} {{ entry.player.last_name }}
                    </div>
                    <div class="sub">
                        <span
                            class="position-badge"
                            :style="{ background: positionColor[entry.player.position] ?? '#999' }"
                        >
                            {{ entry.player.position.slice(0, 3).toUpperCase() }}
                        </span>
                        <span v-if="entry.player.club_name_short">{{
                            entry.player.club_name_short
                        }}</span>
                    </div>
                </div>

                <div class="score">
                    {{ Util.formatNumberWithDot(Math.round(entry.totalScore)) }}
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card {
    background: #ffffff;
    border-radius: 16px;
    padding: 18px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    height: fit-content;
    min-height: 224px;
}

.card-title {
    font-weight: bold;
    font-size: 1em;
    margin-bottom: 16px;
    color: #222;
}

.empty {
    color: #aaa;
    font-size: 0.9em;
    text-align: center;
    padding: 12px 0;
}

.player-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.player-row {
    display: flex;
    align-items: center;
    gap: 12px;
}

.medal {
    font-weight: bold;
    font-size: 1.1em;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
}

.avatar-wrapper {
    flex-shrink: 0;
    border-radius: 50%;
    background: #eee;
    padding: 3px 3px 0 3px;
    overflow: hidden;
    box-sizing: border-box;
    width: 40px;
    height: 40px;
}

.avatar {
    width: 34px;
    height: 34px;
    object-fit: cover;
}

.avatar-fallback {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e0e0e0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.85em;
    color: #555;
    text-transform: uppercase;
}

.info {
    flex: 1;
    min-width: 0;

    .name {
        font-weight: 600;
        font-size: 0.9em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .sub {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 2px;
        font-size: 0.75em;
        color: #666;
    }
}

.position-badge {
    color: #fff;
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 0.75em;
    font-weight: bold;
    letter-spacing: 0.02em;
}

.score {
    font-weight: bold;
    background: #f0f0f0;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 0.85em;
    flex-shrink: 0;
    min-width: 50px;
    text-align: center;
}
</style>

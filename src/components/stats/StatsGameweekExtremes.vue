<script setup lang="ts">
import { Util } from '../../util.ts';

defineProps<{
    best: { week: number; score: number } | null;
    worst: { week: number; score: number } | null;
}>();
</script>

<template>
    <div class="card">
        <div class="card-title">Gameweek Records</div>
        <div v-if="!best && !worst" class="empty">No scores yet</div>
        <div v-else class="rows">
            <div v-if="best" class="row best">
                <div class="accent" />
                <div class="meta">
                    <span class="label">Best</span>
                    <span class="week">GW {{ best.week }}</span>
                </div>
                <div class="score">{{ Util.formatNumberWithDot(best.score) }}</div>
            </div>
            <div v-if="worst" class="row worst">
                <div class="accent" />
                <div class="meta">
                    <span class="label">Worst</span>
                    <span class="week">GW {{ worst.week }}</span>
                </div>
                <div class="score">{{ Util.formatNumberWithDot(worst.score) }}</div>
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
    min-height: fit-content;
}

.card-title {
    font-weight: bold;
    font-size: 1em;
    color: #222;
    margin-bottom: 14px;
}

.rows {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 10px;
    background: #f7f7f7;
}

.accent {
    width: 4px;
    height: 32px;
    border-radius: 2px;
    flex-shrink: 0;
}

.best .accent {
    background: #27ae60;
}

.worst .accent {
    background: #e74c3c;
}

.meta {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.label {
    font-size: 0.7em;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #888;
}

.week {
    font-size: 0.9em;
    font-weight: 500;
    color: #333;
}

.score {
    font-weight: bold;
    font-size: 0.85em;
    color: #222;
    background: #fff;
    padding: 4px 10px;
    border-radius: 8px;
    min-width: 60px;
    text-align: center;
}

.empty {
    color: #aaa;
    font-size: 0.9em;
    text-align: center;
    padding: 12px 0;
}
</style>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { Chart, BarController, BarElement, LinearScale, CategoryScale, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FootballUtil } from '../../FootballUtil.ts';
import Select from 'primevue/select';
import type { PlayerPosition } from '../../model/player.contract.ts';

Chart.register(BarController, BarElement, LinearScale, CategoryScale, Tooltip, ChartDataLabels);

const props = defineProps<{
    players: {
        id: string;
        name: string;
        picture_url?: string;
        club_name_short?: string;
        position?: PlayerPosition;
    }[];
    selectedId: string;
    data: { week: number; score: number }[];
    totalScore?: number;
}>();

const selectedPlayer = computed(() => props.players.find((p) => p.id === props.selectedId));

const positionColor: Record<string, string> = {
    Goalkeeper: '#f5a623',
    Defender: '#4a90d9',
    Midfielder: '#27ae60',
    Forward: '#e74c3c'
};

const emit = defineEmits<{
    'update:selectedId': [id: string];
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

function buildChart() {
    if (!canvas.value) return;
    chart?.destroy();
    chart = new Chart(canvas.value, {
        type: 'bar',
        data: {
            labels: props.data.map((d) => `GW ${d.week}`),
            datasets: [
                {
                    data: props.data.map((d) => d.score),
                    // backgroundColor: props.data.map((d) => FootballUtil.getColorByValue(d.score)),
                    backgroundColor: (context) => {
                        const { chart } = context;
                        const { ctx, chartArea } = chart;

                        if (!chartArea) return undefined; // needed on initial render

                        const value = props.data[context.dataIndex].score;
                        const baseColor = FootballUtil.getColorByValue(value);

                        function hexToRgba(hex: string, alpha: number) {
                            const r = parseInt(hex.slice(1, 3), 16);
                            const g = parseInt(hex.slice(3, 5), 16);
                            const b = parseInt(hex.slice(5, 7), 16);

                            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                        }

                        const transparent = hexToRgba(baseColor, 0.6);

                        const gradient = ctx.createLinearGradient(
                            0,
                            chartArea.bottom,
                            0,
                            chartArea.top
                        );

                        gradient.addColorStop(0, transparent);
                        gradient.addColorStop(0.2, transparent);
                        gradient.addColorStop(1, baseColor);

                        return gradient;
                    },

                    borderRadius: 4,
                    borderSkipped: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            layout: { padding: { top: 20 } },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ${ctx.parsed.y} pts`
                    }
                },
                datalabels: {
                    anchor: 'end',
                    align: 'end',
                    formatter: (value: number) => (value === 0 ? null : value),
                    font: { size: 11, weight: 'bold' },
                    color: '#aaa'
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 }, maxRotation: 90, minRotation: 90 }
                },
                y: {
                    display: false,
                    beginAtZero: true
                }
            }
        }
    });
}

onMounted(buildChart);
watch(() => props.data, () => nextTick(buildChart), { deep: true });
watch(() => props.selectedId, () => nextTick(buildChart));
onUnmounted(() => chart?.destroy());
</script>

<template>
    <div class="card">
        <div class="card-header">
            <div class="card-title">Player Scores</div>
            <Select
                :model-value="selectedId"
                :options="players"
                option-label="name"
                option-value="id"
                @update:model-value="emit('update:selectedId', $event)"
                class="player-select"
                append-to="self"
            />
        </div>
        <div v-if="selectedPlayer" class="player-info">
            <img
                v-if="selectedPlayer.picture_url"
                :src="selectedPlayer.picture_url"
                class="player-avatar"
                :alt="selectedPlayer.name"
            />
            <div v-else class="player-avatar-placeholder" />
            <div class="player-meta">
                <span class="player-name">{{ selectedPlayer.name }}</span>
                <span class="player-details">
                    <span
                        v-if="selectedPlayer.position"
                        class="position-badge"
                        :style="{ background: positionColor[selectedPlayer.position] ?? '#999' }"
                    >
                        {{ selectedPlayer.position.slice(0, 3).toUpperCase() }}
                    </span>
                    <span v-if="selectedPlayer.club_name_short">{{ selectedPlayer.club_name_short }}</span>
                </span>
            </div>
            <div v-if="totalScore != null" class="player-total">
                <span class="player-total-label">total</span>
                <span class="player-total-value">{{ Math.round(totalScore) }}</span>
            </div>
        </div>
        <div v-if="data.length === 0" class="empty">No scores yet</div>
        <div v-else class="chart-container">
            <canvas ref="canvas" />
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

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 12px;
}

.card-title {
    font-weight: bold;
    font-size: 1em;
    color: #222;
}

.player-select {
    max-width: 160px;
    font-size: 0.85em;
}

.player-select :deep(.p-select-label) {
    font-size: 0.78em;
}

.player-select :deep(.p-select-overlay) {
    left: auto !important;
    right: 0;
}

.player-info {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    margin-bottom: 16px;
}

.player-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
}

.player-avatar-placeholder {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #f0f0f0;
    flex-shrink: 0;
}

.player-meta {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.player-name {
    font-weight: 600;
    font-size: 0.95em;
    color: #222;
}

.player-details {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 2px;
    font-size: 0.75em;
    color: #666;
}

.position-badge {
    color: #fff;
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 0.75em;
    font-weight: bold;
    letter-spacing: 0.02em;
}

.player-total {
    margin-left: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    flex-shrink: 0;
}

.player-total-label {
    font-size: 0.65em;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.player-total-value {
    font-weight: bold;
    font-size: 1.1em;
    color: #222;
}

.empty {
    color: #aaa;
    font-size: 0.9em;
    text-align: center;
    padding: 12px 0;
}

.chart-container {
    height: 180px;
    position: relative;
}
</style>

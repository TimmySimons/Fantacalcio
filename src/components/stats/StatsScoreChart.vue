<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Filler,
    Tooltip
} from 'chart.js';

Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Filler,
    Tooltip
);

const props = defineProps<{
    data: { week: number; score: number }[];
}>();

const canvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

function buildChart() {
    if (!canvas.value) return;

    chart?.destroy();

    chart = new Chart(canvas.value, {
        type: 'line',
        data: {
            labels: props.data.map((d) => `GW ${d.week}`),
            datasets: [
                {
                    data: props.data.map((d) => d.score),
                    borderColor: 'darkred',
                    backgroundColor: 'rgba(139,0,0,0.12)',
                    borderWidth: 2,
                    pointBackgroundColor: 'darkred',
                    pointRadius: 4,
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: (ctx) => ` ${ctx.parsed.y} pts`
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11 } }
                },
                y: {
                    grid: { color: 'rgba(0,0,0,0.06)' },
                    ticks: { font: { size: 11 } }
                }
            }
        }
    });
}

onMounted(buildChart);
watch(() => props.data, buildChart, { deep: true });
onUnmounted(() => chart?.destroy());
</script>

<template>
    <div class="card">
        <div class="card-title">Score per Gameweek</div>
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
    min-height: 260px;
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

.chart-container {
    height: 180px;
    position: relative;
}
</style>

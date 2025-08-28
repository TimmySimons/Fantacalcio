<script setup lang="ts">
import { computed } from 'vue';
import { FootballUtil } from '../../../FootballUtil.ts';
import ProgressBar from 'primevue/progressbar';

const props = defineProps<{
    gwCount: number;
    average?: number | null;
    averageDecisive?: number | null;
    averageAllRound?: number | null;
    appearances?: number | null;
}>();

const color = computed(() => {
    return props.average ? FootballUtil.getColorByValue(props.average) : undefined;
});

const progress = computed(() => Math.round(((props.appearances ?? 0) / props.gwCount) * 100));
</script>

<template>
    <div class="wrapper">
        <div class="gws">Last {{ gwCount }}</div>
        <div class="main" :style="{ color: color, borderColor: color }">
            {{ average ?? '-' }}
        </div>
        <div class="flex">
            <div class="sub">{{ averageDecisive ?? '-' }}</div>
            <div class="sub">|</div>
            <div class="sub">{{ averageAllRound ?? '-' }}</div>
        </div>
        <div class="appearances">
            <ProgressBar :value="progress" style="height: 10px"
                ><span class="percentage">{{ progress }}%</span></ProgressBar
            >
        </div>
    </div>
</template>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;

    .gws {
        font-size: 10px;
        font-style: italic;
        font-weight: bold;
    }

    .main {
        height: 48px;
        width: 48px;
        border-radius: 53% / 25%;
        border: 2px solid #f0f0f0;
        color: #f0f0f0;
        font-size: 18px;
        justify-content: center;
        display: flex;
        align-items: center;
    }

    .sub {
        font-size: 9px;
        flex: 1;
        text-align: center;
    }

    .flex {
        gap: 4px;
    }

    .appearances {
        font-size: 10px;
        font-style: italic;
        font-weight: bold;
        width: 60px;
        padding-bottom: 4px;
    }

    .percentage {
        font-size: 8px;
    }
}
</style>

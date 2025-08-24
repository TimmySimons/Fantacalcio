<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface Props {
    targetDate: Date;
}

const props = defineProps<Props>();

const days = ref(0);
const hours = ref(0);
const minutes = ref(0);

let timer: number | undefined;

function updateCountdown() {
    const now = new Date().getTime();
    const target = new Date(props.targetDate).getTime();
    const diff = target - now;

    if (diff <= 0) {
        days.value = 0;
        hours.value = 0;
        minutes.value = 0;
        if (timer) clearInterval(timer);
        return;
    }

    days.value = Math.floor(diff / (1000 * 60 * 60 * 24));
    hours.value = Math.floor((diff / (1000 * 60 * 60)) % 24);
    minutes.value = Math.floor((diff / (1000 * 60)) % 60);
}

onMounted(() => {
    updateCountdown();
    timer = window.setInterval(updateCountdown, 1000 * 30);
});

onUnmounted(() => {
    if (timer) clearInterval(timer);
});
</script>

<template>
    <div class="countdown">
        <span>Starts in:</span>
        <span v-if="days > 0">{{ days }}d </span>
        <span>{{ hours }}h </span>
        <span>{{ minutes }}m</span>
    </div>
</template>

<style scoped>
.countdown {
    display: flex;
    gap: 0.25rem;
}
</style>

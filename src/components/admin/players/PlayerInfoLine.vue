<script setup lang="ts">
defineProps<{
    value: string | undefined;
    bgUrl?: string;
    plain?: boolean;
}>();
</script>

<template>
    <div class="container">
        <div
            class="indicator"
            :style="{ backgroundImage: `url(${bgUrl})` }"
            :class="{ plain: plain && bgUrl }"
        ></div>
        <div class="info">
            <span v-if="value">{{ value }}</span
            ><span v-else class="unknown">—</span>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-bottom: 8px;
    flex-direction: column;
    flex: 1;

    .indicator {
        width: 50px;
        height: 50px;
        background-color: #f0f0f0;
        padding: 4px 12px;
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        border: 1px solid #e6e6e6;

        &.plain {
            background-size: contain;
            background-color: transparent;
            border: none;
            border-radius: 0;
        }
    }

    .info {
        text-align: center;
        font-size: 0.9em;
        line-height: 1.3em;

        .unknown {
            color: #d3d3d3;
        }
    }
}
</style>

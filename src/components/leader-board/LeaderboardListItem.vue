<script setup lang="ts">
import LaurelIcon from '../../assets/icons/laurel.svg';
import type { ManagerContract } from '../../model/manager.contract.ts';
import CaretIcon from '../../assets/icons/caret.svg';

defineProps<{
    place: number;
    manager: ManagerContract;
}>();
</script>

<template>
    <div class="list-item">
        <div class="ranking">
            {{ place }} <component :is="LaurelIcon" class="svg laurel" v-if="place <= 3" />
        </div>
        <div class="names">
            <div>{{ manager.teamName }}</div>
            <div>{{ manager.managerName }}</div>
        </div>
        <div class="gw">+ {{ manager.gameweekScore }}</div>
        <div class="total">{{ manager.totalScore }}</div>
        <component :is="CaretIcon" class="svg caret" />
    </div>
</template>

<style scoped>
.list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 24px;
    padding: 6px 12px;
    border-radius: 12px;
    border: 1px solid lightgray;
    position: relative;
    background: #ffffff5e;

    .laurel {
        position: absolute;
        top: 8px;
        left: 12px;
        height: 36px;
        width: 36px;
    }

    &:first-child {
        border-color: goldenrod;
        .laurel {
            fill: goldenrod;
        }
        .ranking {
            color: goldenrod;
            border: none;
            padding-bottom: 4px;
        }
    }
    &:nth-child(2) {
        border-color: #696969;
        .laurel {
            fill: #696969;
        }
        .ranking {
            color: #696969;
            border: none;
            padding-bottom: 4px;
        }
    }
    &:nth-child(3) {
        border-color: #b16437;
        .laurel {
            fill: #b16437;
        }
        .ranking {
            color: #b16437;
            border: none;
            padding-bottom: 4px;
        }
    }
}

.ranking {
    border: 1px solid lightgray;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #7e7e7e;
}

.names {
    font-size: 0.8em;
    flex: 2;

    > div:first-child {
        font-weight: bold;
    }
    > div:last-child {
        color: #4e4e4e;
    }
}

.total {
    font-weight: bold;
    background: #e6e6e6;
    padding: 2px 8px;
    border-radius: 6px;
}

.caret {
    fill: #9f9f9f;
}

.gw {
    color: #515151;
}
</style>

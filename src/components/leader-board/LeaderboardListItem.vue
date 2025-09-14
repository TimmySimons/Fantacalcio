<script setup lang="ts">
import LaurelIcon from '../../assets/icons/laurel.svg';
import CaretIcon from '../../assets/icons/caret.svg';
import { useFootballScoreStore } from '../../stores/football-scores.store.ts';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import type { ManagerContract } from '../../model/manager.contract.ts';

const props = defineProps<{
    place: number;
    manager: ManagerContract;
}>();

const footballScoreStore = useFootballScoreStore();
const { totalUserScore } = storeToRefs(footballScoreStore);
const router = useRouter();

const onClick = () => {
    router.push({ name: 'ManagerProfile', params: { id: props.manager.id } });
};
</script>

<template>
    <div class="list-item" @click="onClick">
        <div class="ranking">
            {{ place }} <component :is="LaurelIcon" class="svg laurel" v-if="place <= 3" />
        </div>
        <div class="names">
            <div>{{ manager.team_name }}</div>
            <div>{{ manager.name }}</div>
        </div>
        <div class="gw">+{{ 0 }}</div>
        <div class="total">{{ totalUserScore(manager.id) }}</div>
        <component :is="CaretIcon" class="svg caret" />
    </div>
</template>

<style scoped>
.list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 12px;
    border: 1px solid lightgray;
    position: relative;
    background: #ffffff7a;

    &:active {
        scale: 0.98;
    }

    .laurel {
        position: absolute;
        top: 8px;
        left: 12px;
        height: 36px;
        min-width: 36px;
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
    width: 60px;
    text-align: center;
    font-size: 0.9em;
}

.caret {
    fill: #9f9f9f;
    margin-left: 2px;
}

.gw {
    color: #515151;
    font-size: 0.9em;
}
</style>

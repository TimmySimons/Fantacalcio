<script setup lang="ts">
import type { GameweekContract } from '../../model/Gameweek.contract.ts';

const gameweek: GameweekContract = {
    id: '001',
    week: '32',
    year: '2025',
    startDate: new Date(2025, 7, 10),
    endDate: new Date(2025, 7, 17)
};
</script>

<template>
    <div class="banner">
        <div class="week">
            <div>GW</div>
            <div>{{ gameweek.week }}</div>
        </div>
        <!--        <div class="dates">12 Aug - 17 Aug</div>-->
    </div>
</template>

<style scoped>
.banner {
    width: 100%;
    box-sizing: border-box;
    padding: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    height: 44px;

    .week {
        border: 2px solid #f3f3f3;
        border-radius: 100%;
        min-width: 80px;
        min-height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #7c1e1e;
        font-weight: bold;
        font-size: large;
        position: absolute;
        top: 10px;
        left: 18px;

        > div:first-child {
            color: rgba(255, 255, 255, 0.72);
            font-weight: normal;
            margin-right: 2px;
        }
    }
}
</style>

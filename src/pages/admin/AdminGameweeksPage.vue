<script setup lang="ts">
import { useAdminStore } from '../../stores/admin.store.ts';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import GameweekDialog from './dialogs/GameweekDialog.vue';
import dayjs from 'dayjs';

const adminStore = useAdminStore();
const { gameweeks, currentGameweek } = storeToRefs(adminStore);

adminStore.getGameweeks();
adminStore.getCurrentGameweek();
adminStore.getUpcomingGameweek();

const mostFutureGameweek = computed(() =>
    gameweeks.value && gameweeks.value.length > 0
        ? gameweeks.value.sort((a, b) => a.start_date.getTime() - b.start_date.getTime())[0]
        : undefined
);

const showDialog = ref(false);
</script>

<template>
    <div class="title flex items-center">
        Gameweeks
        <div class="flex justify-end">
            <Button label="New Gameweek" @click="showDialog = true" class="new-btn" />
        </div>
    </div>

    <GameweekDialog :prev-gameweek="mostFutureGameweek" v-model="showDialog" />

    <div class="flex col gap-8">
        <div v-for="gameweek in gameweeks" :key="gameweek.id">
            <Card class="card">
                <template #content>
                    <div
                        class="content flex"
                        :class="{ current: gameweek.id === currentGameweek?.id }"
                    >
                        <div class="gw">GW{{ gameweek.week }}</div>
                        <div>
                            <div class="dates flex col justify-end">
                                <span>{{
                                    dayjs(gameweek.start_date).format('DD MMM YYYY HH:mm')
                                }}</span>
                                <span>
                                    {{ dayjs(gameweek.end_date).format('DD MMM YYYY HH:mm') }}</span
                                >
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<style scoped>
.title {
    justify-content: space-between;
}

.card {
    font-size: 0.8em;
    display: flex;
}

.content {
    justify-content: space-between;
    text-align: right;
    align-items: center;

    &.current {
        .gw {
            background: darkred;
            color: white;
        }
    }
}

.gw {
    font-size: 1em;
    font-weight: bold;
    border: 1px solid darkred;
    height: 36px;
    width: 36px;
    padding: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #efefef;
    position: relative;
}
</style>

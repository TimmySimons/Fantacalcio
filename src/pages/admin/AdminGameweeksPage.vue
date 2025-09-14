<script setup lang="ts">
import { useAdminStore } from '../../stores/admin.store.ts';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import GameweekDialog from './dialogs/GameweekDialog.vue';
import dayjs from 'dayjs';
import type { GameweekContract } from '../../model/gameweek.contract.ts';
import { useRouter } from 'vue-router';
import Badge from 'primevue/badge';

const adminStore = useAdminStore();
const { gameweeks, currentGameweek } = storeToRefs(adminStore);

adminStore.getGameweeks();

const showDialog = ref(false);

const router = useRouter();

const onSelect = (gameweek: GameweekContract) => {
    router.push({ name: 'AdminGameweek', params: { id: gameweek.id } });
};
</script>

<template>
    <div class="title flex items-center">
        Gameweeks
        <!--        <div class="flex justify-end">-->
        <!--            <Button label="New Gameweek" @click="showDialog = true" class="new-btn" />-->
        <!--        </div>-->
    </div>

    <GameweekDialog v-model="showDialog" />

    <div class="flex col gap-8">
        <div v-for="gameweek in gameweeks" :key="gameweek.id" @click="onSelect(gameweek)">
            <Card class="card">
                <template #content>
                    <div
                        class="content flex"
                        :class="{ current: gameweek.id === currentGameweek?.id }"
                    >
                        <div class="gw">GW{{ gameweek.week }}</div>
                        <div class="right">
                            <div class="scores" v-if="gameweek.end_date < new Date()">
                                <Badge v-if="gameweek.scores_published_date" :severity="'success'"
                                    >Scores Published</Badge
                                >
                                <Badge v-else :severity="'secondary'">Awaiting Scoring</Badge>
                            </div>
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
    gap: 2px;

    &.current {
        .gw {
            background: darkred;
            color: white;
        }
    }
}

.right {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .dates {
        font-size: 0.8em;
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

.scores {
    display: flex;
    gap: 4px;
}
</style>

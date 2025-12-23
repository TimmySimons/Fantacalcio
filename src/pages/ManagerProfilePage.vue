<script setup lang="ts">
import { useFootballStore } from '../stores/football.store.ts';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { computed, ref, watch } from 'vue';
import FootballField from '../components/team/FootballField.vue';
import GameweekDrawer from '../components/gameweeks/GameweekDrawer.vue';
import type { PlayerContract } from '../model/player.contract.ts';
import GameweekSelector from '../components/gameweeks/GameweekSelector.vue';
import { useFootballScoreStore } from '../stores/football-scores.store.ts';
import ScoresPill from '../components/gameweeks/ScoresPill.vue';
import { FootballUtil } from '../FootballUtil.ts';

const route = useRoute();
const managerId = computed<string>(() => route.params.id as string);

const footballStore = useFootballStore();
const { manager, gameweek, currentGameweek, gameweekTeam, gameweeks } = storeToRefs(footballStore);
const footballScoreStore = useFootballScoreStore();

gameweek.value = undefined;
gameweekTeam.value = undefined;

const isLoading = computed(() => {
    return !(manager.value && gameweeks.value && gameweek.value);
});

watch(
    managerId,
    (id: string) => {
        footballStore.getManagers().then(() => footballStore.getManager(id));
        footballStore.getAllGameweeks().then(() => {
            if (currentGameweek.value) {
                footballStore.getGameweek(currentGameweek.value.id);
            }
        });
        footballStore.getAllGameweeks();
        footballScoreStore.getAllUsersGameweeksTeamPlayers();
    },
    { immediate: true }
);

const fieldPlayers = computed(() => gameweekTeam.value?.team_players ?? []);
const selectedPlayer = ref<PlayerContract | undefined>();

const showDrawer = ref(false);

watch(gameweek, async () => {
    if (gameweek.value) {
        await footballStore.getGameweekTeam(gameweek.value.id, managerId.value);
        await footballScoreStore.getUserGameweeksTeamPlayers(managerId.value);

        const playersWithoutAwayTeam = fieldPlayers.value.filter(
            (p) => !p.PlayersAwayTeams || p.PlayersAwayTeams.length === 0
        );
        if (playersWithoutAwayTeam.length > 0) {
            await footballStore.getPlayersAwayTeams(
                gameweek.value.id,
                playersWithoutAwayTeam.map((p) => p.sorare_slug),
                gameweek.value.sorare_slug
            );
            footballStore.getGameweekTeam(gameweek.value.id, managerId.value);
        }
    }
});

const nonFutureGameweeks = computed(() => {
    return gameweeks.value?.filter((gw) => gw.start_date.getTime() < new Date().getTime()) ?? [];
});
</script>

<template>
    <div class="page-content">
        <GameweekDrawer v-if="gameweeks" :gameweeks="nonFutureGameweeks" v-model="showDrawer" />

        <div class="top">
            <RouterLink :to="{ name: 'Leaderboard' }" class="return-link">
                <i class="pi pi-arrow-circle-left" style="font-size: 1.6rem"></i>
            </RouterLink>

            <div>{{ manager?.team_name }}</div>
            <div class="manager">{{ manager?.name }}</div>
        </div>

        <div class="content">
            <GameweekSelector
                class="gw-selector"
                :gameweek="gameweek"
                :complete="false"
                :is-locked="true"
                @click-week="showDrawer = true"
            />

            <div class="top-info">
                <template v-if="FootballUtil.isCurrentGameweek(gameweek)" class="current">
                    <span></span>
                    <span class="now">Now playing!</span>
                </template>
                <div v-else-if="gameweek && !gameweek.scores_published_date">Awaiting scores</div>

                <ScoresPill :manager-id="managerId" />
            </div>

            <FootballField
                v-model="selectedPlayer"
                :included-players="fieldPlayers"
                :show-points="true"
                :is-locked="true"
                :is-loading="isLoading"
                :show-direct-dialog="true"
            />
        </div>
    </div>
</template>

<style scoped>
.page-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: #470000;

    .top {
        height: 100px;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 1.2em;
        font-weight: bold;
        padding-top: 14px;

        .manager {
            font-size: 0.6em;
            font-weight: normal;
            color: #b8b8b8;
            line-height: 1em;
        }
    }

    .gw-selector {
        position: absolute;
        top: -40px;
        left: 18px;
        width: fit-content;
        z-index: 10;
    }

    .content {
        display: flex;
        flex-direction: column;
        gap: 12px;
        flex: 1;
        background-color: #f3f3f3;
        padding: 12px 18px 24px 18px;
        border-radius: 24px 24px 0 0;
        position: relative;
        z-index: 10;
    }
}

.return-link {
    position: absolute;
    top: 18px;
    left: 18px;
    color: white;
}

.top-info {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 0.8em;
    color: #8a8a8a;
    gap: 12px;

    > {
        flex: 1;
    }
}
.now {
    color: darkred;
    padding: 2px 20px;
    text-align: center;
    box-shadow: inset 0px 0px 12px rgba(161, 2, 2, 0.15);
    border-radius: 20px;
}
</style>

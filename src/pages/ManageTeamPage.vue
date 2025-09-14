<script setup lang="ts">
import { type PlayerContract } from '../model/player.contract.ts';
import PlayerRow from '../components/team/PlayerRow.vue';
import GameweekBanner from '../components/gameweeks/GameweekBanner.vue';
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useFootballStore } from '../stores/football.store.ts';
import { FootballUtil } from '../FootballUtil.ts';
import GameweekDrawer from '../components/gameweeks/GameweekDrawer.vue';
import { useAuthStore } from '../stores/auth.store.ts';
import { useFootballScoreStore } from '../stores/football-scores.store.ts';
import FootballField from '../components/team/FootballField.vue';
import ScoresPill from '../components/gameweeks/ScoresPill.vue';

const footballStore = useFootballStore();
const { gameweeks, currentGameweek, nextGameweek, gameweek, gameweekTeam, userPlayers } =
    storeToRefs(footballStore);
const authStore = useAuthStore();
const { appUser } = storeToRefs(authStore);

const footballScoreStore = useFootballScoreStore();
footballScoreStore.getUserGameweeksTeamPlayers(useAuthStore().appUser!.id);
footballScoreStore.getAllUsersGameweeksTeamPlayers();

footballStore.getAllGameweeks().then(() => {
    if (currentGameweek.value) {
        footballStore.getGameweek(currentGameweek.value.id);
    }
});
footballStore.getUserPlayers();

watch(gameweek, () => {
    if (gameweek.value) {
        gameweekTeam.value = undefined;
        selectedPlayer.value = undefined;
        footballStore.getGameweekTeam(gameweek.value.id, appUser.value!.id).then(async () => {
            if (!gameweekTeam.value) {
                await footballStore.createGameweekTeam(gameweek.value!.id);
                await footballStore.getGameweekTeam(gameweek.value!.id, appUser.value!.id);
            }
        });
    }
});

const isLoading = computed(() => {
    return !(gameweeks.value && gameweek.value && gameweekTeam.value && userPlayers.value);
});

const isLockedGameweek = computed(() => {
    return FootballUtil.isLockedGameweek(gameweek.value);
});

const selectedPlayer = ref<PlayerContract | undefined>();

const benchSitters = computed(() =>
    (userPlayers.value ?? [])
        .filter((p) => !allIncludedPlayersOnField.value.map((p2) => p2.id).includes(p.id))
        .sort((a, b) => positionOrder[a.position] - positionOrder[b.position])
);

const positionOrder: Record<string, number> = {
    Goalkeeper: 1,
    Defender: 2,
    Midfielder: 3,
    Forward: 4
};

const allIncludedPlayersOnField = computed(() => gameweekTeam.value?.team_players ?? []);

const onAddToTeam = async () => {
    if (
        selectedPlayer.value &&
        !allIncludedPlayersOnField.value.map((p) => p.id).includes(selectedPlayer.value.id)
    ) {
        if (gameweek.value && gameweekTeam.value) {
            await footballStore
                .addTeamPlayers(gameweekTeam.value.id, [selectedPlayer.value.id])
                .then(() => {
                    if (appUser.value) {
                        footballStore.getGameweekTeam(gameweek.value!.id, appUser.value.id, true);
                    }
                });
        }
    }

    selectedPlayer.value = undefined;
};

const onBench = async () => {
    if (
        selectedPlayer.value &&
        allIncludedPlayersOnField.value.map((p) => p.id).includes(selectedPlayer.value.id)
    ) {
        if (gameweek.value && gameweekTeam.value) {
            await footballStore
                .removeTeamPlayers(gameweekTeam.value.id, [selectedPlayer.value.id])
                .then(() =>
                    footballStore.getGameweekTeam(gameweek.value!.id, appUser.value!.id, true)
                );
        }
    }

    selectedPlayer.value = undefined;
};

const onClearField = () => {
    footballStore
        .removeAllTeamPlayers(gameweekTeam.value!.id)
        .then(() => footballStore.getGameweekTeam(gameweek.value!.id, appUser.value!.id));
};

const onClickMove = (action: 'add' | 'remove') => {
    if (action === 'remove') {
        onBench();
    } else {
        onAddToTeam();
    }
};

const showDrawer = ref(false);
const pointsView = ref(false);

const showPoints = computed(() => isLockedGameweek.value || pointsView.value);

const onManageNext = () => {
    if (nextGameweek.value) {
        footballStore.getGameweek(nextGameweek.value.id);
    }
};

const onFillRandom = () => {
    if (userPlayers.value && gameweekTeam.value) {
        try {
            const team = FootballUtil.getRandomTeam(userPlayers.value);

            footballStore.removeAllTeamPlayers(gameweekTeam.value.id).then(async () => {
                await footballStore.addTeamPlayers(
                    gameweekTeam.value!.id,
                    team.map((p) => p.id)
                );
                await footballStore.getGameweekTeam(gameweek.value!.id, appUser.value!.id);
            });
        } catch (error) {
            console.error(error);
        }
    }
};
</script>

<template>
    <div class="wrapper">
        <GameweekBanner
            :gameweek="gameweek"
            :complete="allIncludedPlayersOnField.length === 11"
            :is-locked="isLockedGameweek"
            @click-week="showDrawer = true"
        />

        <GameweekDrawer v-if="gameweeks" :gameweeks="gameweeks" v-model="showDrawer" />

        <div class="content-container" :class="{ 'points-inline': pointsView }">
            <div
                class="flex justify-end toggle"
                :class="{ current: FootballUtil.isCurrentGameweek(gameweek) }"
            >
                <template v-if="!isLockedGameweek">
                    <span>Points</span>
                    <ToggleSwitch v-model="pointsView" />
                </template>
                <template v-else-if="FootballUtil.isCurrentGameweek(gameweek)" class="current">
                    <span></span>
                    <span class="now">Now playing!</span>
                    <span v-if="nextGameweek" class="next" @click="onManageNext"
                        >Manage next <i class="pi pi-chevron-right" style="font-size: 8px"></i
                    ></span>
                </template>
                <template v-else>
                    <div v-if="!gameweek?.scores_published_date">Awaiting scores</div>
                    <ScoresPill :manager-id="appUser!.id" />
                </template>
            </div>

            <FootballField
                v-model="selectedPlayer"
                :included-players="allIncludedPlayersOnField"
                :show-points="showPoints"
                :is-locked="isLockedGameweek"
                :is-loading="isLoading"
                @move="onClickMove"
            >
                <template #options>
                    <div class="buttons" v-if="!isLockedGameweek">
                        <div class="btn disabled">Load Previous Team</div>
                        <div class="btn" @click="onFillRandom">Fill Random</div>
                        <div
                            class="btn"
                            @click="onClearField"
                            :class="{ disabled: allIncludedPlayersOnField.length === 0 }"
                        >
                            Clear Field
                        </div>
                    </div>
                </template>
            </FootballField>

            <div
                class="substitutes grid"
                v-if="!isLockedGameweek"
                :class="{ empty: benchSitters.length === 0 }"
            >
                <div class="none" v-if="benchSitters.length === 0">No players available</div>
                <PlayerRow
                    v-else
                    class="scrollable"
                    :players="benchSitters"
                    group="bench"
                    :selected-player="selectedPlayer"
                    :included-players="allIncludedPlayersOnField"
                    :is-disabled="isLockedGameweek"
                    :show-points="pointsView"
                    @click="(p) => (selectedPlayer = p)"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;

    .content-container {
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        background: #f3f3f3;
        border-radius: 0 24px 0 0;
        gap: 8px;
        padding: 6px 14px 12px;
    }
}

.substitutes {
    width: 100%;
    min-height: 112px;
    height: auto;
    border-radius: 12px;
    padding: 10px 2px;
    border: 1px solid #dcdcdc;
    background: #fff;
    box-shadow: 0px 3px 6px 0px rgb(0 0 0 / 9%);

    :deep(.svg) {
        min-height: 36px;
        min-width: 36px;
    }

    .scrollable {
        overflow-y: auto;
        height: 94px;
    }

    .none {
        text-align: center;
        font-size: 0.8em;
        color: #999;
    }

    &.empty {
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.buttons {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding-top: 8px;

    .btn {
        flex: 1;
        font-size: 0.6em;
        height: 22px;
        border-radius: 6px;
        background: #fff;
        border: 1px solid darkred;
        color: darkred;
        justify-content: center;
        display: flex;
        align-items: center;
        gap: 6px;
        cursor: pointer;

        &.disabled {
            opacity: 0.5;
            filter: grayscale(1);
            cursor: not-allowed;
        }
    }
}

.toggle {
    height: 50px;
    align-items: center;
    font-size: 0.7em;
    color: #8a8a8a;
    gap: 8px;

    &.current {
        justify-content: space-around;

        span {
            flex: 1;
        }
    }

    .now {
        color: darkred;
        padding: 2px 8px;
        border-radius: 24px;
        border: 1px solid darkred;
        text-align: center;
    }

    .next {
        text-align: right;

        &:active {
            color: darkred;
        }
    }
}
</style>

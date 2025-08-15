<script setup lang="ts">
import { type PlayerContract, PlayerPosition } from '../model/player.contract.ts';
import PlayerRow from '../components/team/PlayerRow.vue';
import AppTabMenu from '../components/AppTabMenu.vue';
import GameweekBanner from '../components/gameweeks/GameweekBanner.vue';
import { computed, ref } from 'vue';
import ShieldIcon from '../assets/icons/soccer-shield.svg';
import CaretIcon from '../assets/icons/caret.svg';
import { storeToRefs } from 'pinia';
import { useFootballStore } from '../stores/football.store.ts';

const footballStore = useFootballStore();
const { gameweek, gameweekTeam, userPlayers } = storeToRefs(footballStore);

footballStore.getUserPlayers();
footballStore.getCurrentGameweek().then(() => {
    if (gameweek.value) {
        footballStore.getGameweekTeam(gameweek.value.id).then(() => {
            if (!gameweekTeam.value) {
                footballStore.createGameweekTeam(gameweek.value!.id);
            }
        });
    }
});

const tabItems = [
    { label: 'My Team', route: { name: 'ManageTeam' } },
    { label: 'Points', route: { name: 'ManageTeam' } }
];

const selectedPlayer = ref<PlayerContract | undefined>();

const includedKeepers = computed<PlayerContract[]>(
    () =>
        gameweekTeam.value?.team_players.filter((p) => p.position === PlayerPosition.Goalkeeper) ??
        []
);
const includedDefenders = computed<PlayerContract[]>(
    () =>
        gameweekTeam.value?.team_players.filter((p) => p.position === PlayerPosition.Defender) ?? []
);
const includedMidfielders = computed<PlayerContract[]>(
    () =>
        gameweekTeam.value?.team_players.filter((p) => p.position === PlayerPosition.Midfielder) ??
        []
);
const includedForwards = computed<PlayerContract[]>(
    () =>
        gameweekTeam.value?.team_players.filter((p) => p.position === PlayerPosition.Forward) ?? []
);

const benchSitters = computed(() =>
    (userPlayers.value ?? [])
        .filter((p) => !allIncludedPlayers.value.map((p2) => p2.id).includes(p.id))
        .sort((a, b) => positionOrder[a.position] - positionOrder[b.position])
);

const positionOrder: Record<string, number> = {
    Goalkeeper: 1,
    Defender: 2,
    Midfielder: 3,
    Forward: 4
};

const allIncludedPlayers = computed(() => {
    return includedKeepers.value.concat(
        includedDefenders.value,
        includedMidfielders.value,
        includedForwards.value
    );
});

const onAddToTeam = async () => {
    if (
        selectedPlayer.value &&
        !allIncludedPlayers.value.map((p) => p.id).includes(selectedPlayer.value.id)
    ) {
        if (gameweek.value && gameweekTeam.value) {
            await footballStore
                .addTeamPlayer(gameweekTeam.value.id, selectedPlayer.value.id)
                .then(() => footballStore.getGameweekTeam(gameweek.value!.id));
        }
    }

    selectedPlayer.value = undefined;
};

const showBenchBtn = computed(() => {
    return (
        selectedPlayer.value &&
        allIncludedPlayers.value.map((p) => p.id).includes(selectedPlayer.value.id)
    );
});

const onBench = async () => {
    if (
        selectedPlayer.value &&
        allIncludedPlayers.value.map((p) => p.id).includes(selectedPlayer.value.id)
    ) {
        if (gameweek.value && gameweekTeam.value) {
            await footballStore
                .removeTeamPlayers(gameweekTeam.value.id, [selectedPlayer.value.id])
                .then(() => footballStore.getGameweekTeam(gameweek.value!.id));
        }
    }

    selectedPlayer.value = undefined;
};

const onClearField = () => {
    footballStore
        .removeAllTeamPlayers(gameweekTeam.value!.id)
        .then(() => footballStore.getGameweekTeam(gameweek.value!.id));
};

const onClickMove = () => {
    if (isSelectedBenchPlayerDisabled.value) return;
    if (showBenchBtn.value) {
        onBench();
    } else {
        onAddToTeam();
    }
};

// TODO: make reusable function
const isSelectedBenchPlayerDisabled = computed(() => {
    if (!allIncludedPlayers.value || !selectedPlayer.value) return false;
    if (allIncludedPlayers.value.map((p) => p.id).includes(selectedPlayer.value.id)) return false;

    if (allIncludedPlayers.value.length >= 11) return true;
    if (
        !allIncludedPlayers.value.find((p) => p.position === PlayerPosition.Goalkeeper) &&
        selectedPlayer.value.position !== PlayerPosition.Goalkeeper &&
        allIncludedPlayers.value.length >= 10
    ) {
        return true;
    }

    const includedPlayersOfType = allIncludedPlayers.value.filter(
        (p) => p.position === selectedPlayer.value!.position
    );

    if (selectedPlayer.value.position === 'Goalkeeper') {
        if (includedPlayersOfType.length >= 1) return true;
    } else if (includedPlayersOfType.length >= 4) return true;

    return false;
});
</script>

<template>
    <div class="wrapper">
        <GameweekBanner :gameweek="gameweek" :complete="allIncludedPlayers.length === 11" />
        <div class="content-container">
            <AppTabMenu :items="tabItems" :tab-style="true" />
            <div class="pad">
                <div class="buttons">
                    <div class="btn disabled">Load Previous Team</div>
                    <div
                        class="btn"
                        @click="onClearField"
                        :class="{ disabled: allIncludedPlayers.length === 0 }"
                    >
                        Clear Field
                    </div>
                </div>
                <div class="pitch card">
                    <div class="players-layer">
                        <PlayerRow
                            :players="includedKeepers"
                            group="keepers"
                            :selected-player="selectedPlayer"
                            @click="(p) => (selectedPlayer = p)"
                        />
                        <PlayerRow
                            :players="includedDefenders"
                            group="keepers"
                            :selected-player="selectedPlayer"
                            @click="(p) => (selectedPlayer = p)"
                        />
                        <PlayerRow
                            :players="includedMidfielders"
                            group="keepers"
                            :selected-player="selectedPlayer"
                            @click="(p) => (selectedPlayer = p)"
                        />
                        <PlayerRow
                            :players="includedForwards"
                            group="keepers"
                            :selected-player="selectedPlayer"
                            @click="(p) => (selectedPlayer = p)"
                        />
                        <div class="position-group hidden">
                            <div class="player"></div>
                        </div>
                    </div>
                </div>

                <div class="player-info" v-if="selectedPlayer">
                    <component :is="ShieldIcon" class="svg" />
                    <div class="info">
                        <div>{{ selectedPlayer.first_name + ' ' + selectedPlayer.last_name }}</div>
                        <div>{{ selectedPlayer.position }}</div>
                        <div>{{ selectedPlayer.club }}</div>
                    </div>
                    <div class="scores">
                        <div>126</div>
                        <div class="new">+13</div>
                    </div>
                    <div
                        v-if="!isSelectedBenchPlayerDisabled"
                        class="move"
                        :class="{ remove: showBenchBtn }"
                        @click="onClickMove"
                    >
                        <component :is="CaretIcon" class="svg" />
                    </div>
                </div>
            </div>

            <div class="substitutes grid" :class="{ empty: benchSitters.length === 0 }">
                <div class="none" v-if="benchSitters.length === 0">No players available</div>
                <PlayerRow
                    v-else
                    class="scrollable"
                    :players="benchSitters"
                    group="bench"
                    :selected-player="selectedPlayer"
                    :included-players="allIncludedPlayers"
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
        gap: 12px;
        padding: 6px 18px 12px;
    }

    .pad {
        height: 100%;
        width: 100%;
        padding-top: 8px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 8px;
        justify-content: space-between;
        position: relative;
    }

    .card {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        position: relative;
    }

    .players-layer {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        padding: 18px 6px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 12px;
        justify-content: space-between;
    }

    .player {
        height: 46px;
        width: 46px;
    }
}
.pitch {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-image: url('../assets/football-pitch-green.png');
    background-size: 100% 100%;
}

.substitutes {
    width: 100%;
    min-height: 122px;
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
        height: 100px;
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

    .btn {
        flex: 1;
        min-width: 120px;
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

.player-info {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    height: 66px;
    width: 96%;
    display: flex;
    align-items: start;
    padding: 6px 12px;
    box-sizing: border-box;
    font-size: 0.7em;
    gap: 8px;
    background: #50945feb;
    border: 1px solid #0b6e1547;
    border-radius: 6px;
    color: #fff;
    font-weight: bold;
    box-shadow: 0px 3px 6px 0px rgb(0 0 0 / 39%);

    .svg {
        height: 100%;
        width: auto;
        fill: white;
        z-index: 3;
    }

    > div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
    }

    .info {
        flex: 1;
    }

    .scores,
    .move {
        height: 100%;
        width: 50px;
        border-radius: 6px;
        background: rgba(0, 0, 0, 0.2);
        align-items: center;
        font-size: 1.5em;

        .new {
            font-size: 0.7em;
            color: #e8e8e8;
        }

        .svg {
            rotate: -90deg;
            max-width: 30px;
        }
    }

    .move {
        background-color: #093400;
        border: 1px solid #0f2700;

        &.remove {
            .svg {
                rotate: 90deg;
            }
        }
    }
}
</style>

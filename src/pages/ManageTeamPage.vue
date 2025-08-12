<script setup lang="ts">
import { type PlayerContract, PlayerPosition } from '../model/player.contract.ts';
import PlayerRow from '../components/team/PlayerRow.vue';
import AppTabMenu from '../components/AppTabMenu.vue';
import GameweekBanner from '../components/gameweeks/GameweekBanner.vue';
import { computed, ref } from 'vue';
import type { TeamContract } from '../model/team.contract.ts';
import ShieldIcon from '../assets/icons/soccer-shield.svg';
import CaretIcon from '../assets/icons/caret.svg';

const tabItems = [
    { label: 'My Team', route: { name: 'ManageTeam' } },
    { label: 'Points', route: { name: 'ManageTeam' } }
];

const players: PlayerContract[] = [
    {
        id: '001',
        firstName: 'Robert',
        lastName: 'Sanchez',
        position: PlayerPosition.Goalkeeper,
        team: 'FC Barcelona'
    },
    {
        id: '002',
        firstName: 'Robert',
        lastName: 'Aina',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '003',
        firstName: 'Robert',
        lastName: 'Van de Ven',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '008',
        firstName: 'Robert',
        lastName: 'De Cuyper',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '009',
        firstName: 'Robert',
        lastName: 'Gvardiol',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '010',
        firstName: 'Robert',
        lastName: 'Vuskovic',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '004',
        firstName: 'Robert',
        lastName: 'Reijnders',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '007',
        firstName: 'Robert',
        lastName: 'Sadiki',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '022',
        firstName: 'Robert',
        lastName: 'M. Salah',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '4005',
        firstName: 'Robert',
        lastName: 'Bowen',
        position: PlayerPosition.Forward,
        team: 'FC Barcelona'
    },
    {
        id: '3012',
        firstName: 'Robert',
        lastName: 'Watkins',
        position: PlayerPosition.Forward,
        team: 'FC Barcelona'
    },
    {
        id: '2001',
        firstName: 'Robert',
        lastName: 'lll',
        position: PlayerPosition.Goalkeeper,
        team: 'FC Barcelona'
    },
    {
        id: '2002',
        firstName: 'Robert',
        lastName: 'ooo',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '1003',
        firstName: 'Robert',
        lastName: 'bbb',
        position: PlayerPosition.Forward,
        team: 'FC Barcelona'
    },
    {
        id: '1008',
        firstName: 'Robert',
        lastName: 'mmm',
        position: PlayerPosition.Forward,
        team: 'FC Barcelona'
    },
    {
        id: '1009',
        firstName: 'Robert',
        lastName: 'nnn',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '1004',
        firstName: 'Robert',
        lastName: 'ttt',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '1007',
        firstName: 'Robert',
        lastName: 'www',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '122',
        firstName: 'Robert',
        lastName: 'zzz',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '105',
        firstName: 'Robert',
        lastName: 'yyy',
        position: PlayerPosition.Forward,
        team: 'FC Barcelona'
    },
    {
        id: '112',
        firstName: 'Robert',
        lastName: 'xxx',
        position: PlayerPosition.Forward,
        team: 'FC Barcelona'
    },
    {
        id: '33112',
        firstName: 'Robert',
        lastName: 'uuu',
        position: PlayerPosition.Forward,
        team: 'FC Barcelona'
    }
];

const team: TeamContract = {
    id: '001',
    gameWeek: { id: '001', year: 2025, week: 12, startDate: new Date(), endDate: new Date() },
    players: players,
    includedPlayers: []
};

const selectedPlayer = ref<PlayerContract | undefined>();

const benchSitters = ref<PlayerContract[]>(team.players);
const includedKeepers = ref<PlayerContract[]>([]);
const includedDefenders = ref<PlayerContract[]>([]);
const includedMidfielders = ref<PlayerContract[]>([]);
const includedForwards = ref<PlayerContract[]>([]);

const positionOrder: Record<string, number> = {
    Goalkeeper: 1,
    Defender: 2,
    Midfielder: 3,
    Forward: 4
};

const sortedBench = computed(() =>
    [...benchSitters.value].sort((a, b) => positionOrder[a.position] - positionOrder[b.position])
);

const allIncludedPlayers = computed(() => {
    return includedKeepers.value.concat(
        includedDefenders.value,
        includedMidfielders.value,
        includedForwards.value
    );
});

const onClickPitch = () => {
    if (
        selectedPlayer.value &&
        !allIncludedPlayers.value.map((p) => p.id).includes(selectedPlayer.value.id)
    ) {
        switch (selectedPlayer.value.position) {
            case PlayerPosition.Goalkeeper:
                includedKeepers.value.push(selectedPlayer.value);
                break;
            case PlayerPosition.Defender:
                includedDefenders.value.push(selectedPlayer.value);
                break;
            case PlayerPosition.Midfielder:
                includedMidfielders.value.push(selectedPlayer.value);
                break;
            case PlayerPosition.Forward:
                includedForwards.value.push(selectedPlayer.value);
                break;
        }

        benchSitters.value = benchSitters.value.filter((p) => p.id !== selectedPlayer.value!.id);
    }

    selectedPlayer.value = undefined;
};

const showBenchBtn = computed(() => {
    return (
        selectedPlayer.value &&
        allIncludedPlayers.value.map((p) => p.id).includes(selectedPlayer.value.id)
    );
});

const onBench = () => {
    if (
        selectedPlayer.value &&
        allIncludedPlayers.value.map((p) => p.id).includes(selectedPlayer.value.id)
    ) {
        switch (selectedPlayer.value.position) {
            case PlayerPosition.Goalkeeper:
                includedKeepers.value = includedKeepers.value.filter(
                    (p) => p.id !== selectedPlayer.value!.id
                );
                break;
            case PlayerPosition.Defender:
                includedDefenders.value = includedDefenders.value.filter(
                    (p) => p.id !== selectedPlayer.value!.id
                );
                break;
            case PlayerPosition.Midfielder:
                includedMidfielders.value = includedMidfielders.value.filter(
                    (p) => p.id !== selectedPlayer.value!.id
                );
                break;
            case PlayerPosition.Forward:
                includedForwards.value = includedForwards.value.filter(
                    (p) => p.id !== selectedPlayer.value!.id
                );
                break;
        }

        benchSitters.value.push(selectedPlayer.value);
    }

    selectedPlayer.value = undefined;
};

const onClearField = () => {
    includedKeepers.value = [];
    includedDefenders.value = [];
    includedMidfielders.value = [];
    includedForwards.value = [];
    benchSitters.value = [...players];
};

const onClickMove = () => {
    if (isSelectedBenchPlayerDisabled.value) return;
    if (showBenchBtn.value) {
        onBench();
    } else {
        onClickPitch();
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
        <GameweekBanner />
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
                        <div>{{ selectedPlayer.firstName + ' ' + selectedPlayer.lastName }}</div>
                        <div>{{ selectedPlayer.position }}</div>
                        <div>{{ selectedPlayer.team }}</div>
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

            <div class="substitutes grid">
                <PlayerRow
                    class="scrollable"
                    :players="sortedBench"
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

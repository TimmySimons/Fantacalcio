<script setup lang="ts">
import { type PlayerContract, PlayerPosition } from '../model/player.contract.ts';
import PlayerRow from '../components/team/PlayerRow.vue';
import AppTabMenu from '../components/AppTabMenu.vue';
import GameweekBanner from '../components/gameweeks/GameweekBanner.vue';
import { computed, ref } from 'vue';
import type { TeamContract } from '../model/team.contract.ts';

const tabItems = [
    { label: 'My Team', route: { name: 'ManageTeam' } },
    { label: 'Points', route: { name: 'ManageTeam' } }
];

const players: PlayerContract[] = [
    {
        id: '001',
        firstName: 'Some Keeper',
        lastName: 'Sanchez',
        position: PlayerPosition.Goalkeeper,
        team: 'FC Barcelona'
    },
    {
        id: '002',
        firstName: 'Some Defender',
        lastName: 'Aina',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '003',
        firstName: 'Some Defender',
        lastName: 'Van de Ven',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '008',
        firstName: 'Some Defender',
        lastName: 'De Cuyper',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '009',
        firstName: 'Some Defender',
        lastName: 'Gvardiol',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '010',
        firstName: 'Some Defender',
        lastName: 'Vuskovic',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '004',
        firstName: 'Some Midfielder',
        lastName: 'Reijnders',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '007',
        firstName: 'Some Midfielder',
        lastName: 'Sadiki',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '022',
        firstName: 'Some Midfielder',
        lastName: 'M. Salah',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '4005',
        firstName: 'Some Forward',
        lastName: 'Bowen',
        position: PlayerPosition.Forward,
        team: 'FC Barcelona'
    },
    {
        id: '3012',
        firstName: 'Some Forward',
        lastName: 'Watkins',
        position: PlayerPosition.Forward,
        team: 'FC Barcelona'
    },
    {
        id: '2001',
        firstName: 'Some Keeper',
        lastName: 'lll',
        position: PlayerPosition.Goalkeeper,
        team: 'FC Barcelona'
    },
    {
        id: '2002',
        firstName: 'Some Defender',
        lastName: 'ooo',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '1003',
        firstName: 'Some Defender',
        lastName: 'bbb',
        position: PlayerPosition.Forward,
        team: 'FC Barcelona'
    },
    {
        id: '1008',
        firstName: 'Some Defender',
        lastName: 'mmm',
        position: PlayerPosition.Forward,
        team: 'FC Barcelona'
    },
    {
        id: '1009',
        firstName: 'Some Defender',
        lastName: 'nnn',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '1004',
        firstName: 'Some Midfielder',
        lastName: 'ttt',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '1007',
        firstName: 'Some Midfielder',
        lastName: 'www',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '122',
        firstName: 'Some Midfielder',
        lastName: 'zzz',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '105',
        firstName: 'Some Forward',
        lastName: 'yyy',
        position: PlayerPosition.Forward,
        team: 'FC Barcelona'
    },
    {
        id: '112',
        firstName: 'Some Forward',
        lastName: 'xxx',
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
                <div class="pitch card" @click="onClickPitch">
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

                    <Button
                        v-if="showBenchBtn"
                        class="bench-btn"
                        label="Bench Player"
                        icon="pi pi-trash"
                        @click="onBench"
                    />
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

    .bench-btn {
        position: absolute;
        bottom: 6px;
        left: 50%;
        transform: translateX(-50%);
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
</style>

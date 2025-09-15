<script setup lang="ts">
import PlayerRow from './PlayerRow.vue';
import { computed, ref } from 'vue';
import { type PlayerContract, PlayerPosition } from '../../model/player.contract.ts';
import PlayerInfo from './PlayerInfo.vue';
import { FootballUtil } from '../../FootballUtil.ts';
import PlayerDialog from '../../pages/admin/dialogs/PlayerDialog.vue';
import { useFootballStore } from '../../stores/football.store.ts';
import { storeToRefs } from 'pinia';

const props = defineProps<{
    includedPlayers: PlayerContract[];
    showPoints: boolean;
    isLocked: boolean;
    isLoading: boolean;
    showDirectDialog?: boolean;
}>();

const selectedPlayer = defineModel<PlayerContract | undefined>({ required: false });

defineEmits<{
    (e: 'move', action: 'add' | 'remove'): void;
}>();

const includedKeepers = computed<PlayerContract[]>(() =>
    props.includedPlayers.filter((p) => p.position === PlayerPosition.Goalkeeper)
);
const includedDefenders = computed<PlayerContract[]>(() =>
    props.includedPlayers.filter((p) => p.position === PlayerPosition.Defender)
);
const includedMidfielders = computed<PlayerContract[]>(() =>
    props.includedPlayers.filter((p) => p.position === PlayerPosition.Midfielder)
);
const includedForwards = computed<PlayerContract[]>(() =>
    props.includedPlayers.filter((p) => p.position === PlayerPosition.Forward)
);

const showBenchBtn = computed(() => {
    return (
        selectedPlayer.value &&
        props.includedPlayers.map((p) => p.id).includes(selectedPlayer.value.id)
    );
});

const footballStore = useFootballStore();
const { playerDetailed } = storeToRefs(footballStore);

const onClickPlayer = (player: PlayerContract | undefined) => {
    selectedPlayer.value = player;

    if (player && props.showDirectDialog) {
        footballStore.getPlayer(player.id, true);
        showPlayerDialog.value = true;
    }
};

const showPlayerDialog = ref(false);
</script>

<template>
    <div class="pad">
        <slot name="options"></slot>
        <div class="pitch card">
            <div class="loading" v-if="isLoading">
                <i class="pi pi-spin pi-spinner" style="font-size: 24px"></i>
            </div>
            <div class="players-layer">
                <PlayerRow
                    :players="includedKeepers"
                    group="keepers"
                    :selected-player="selectedPlayer"
                    :show-points="showPoints"
                    @click="onClickPlayer"
                />
                <PlayerRow
                    :players="includedDefenders"
                    group="keepers"
                    :selected-player="selectedPlayer"
                    :show-points="showPoints"
                    @click="onClickPlayer"
                />
                <PlayerRow
                    :players="includedMidfielders"
                    group="keepers"
                    :selected-player="selectedPlayer"
                    :show-points="showPoints"
                    @click="onClickPlayer"
                />
                <PlayerRow
                    :players="includedForwards"
                    group="keepers"
                    :selected-player="selectedPlayer"
                    :show-points="showPoints"
                    @click="onClickPlayer"
                />
                <div class="position-group hidden">
                    <div class="player"></div>
                </div>
            </div>
        </div>

        <PlayerInfo
            v-if="!showDirectDialog"
            :selected-player="selectedPlayer"
            :can-move="
                !(
                    isLocked ||
                    FootballUtil.isSelectedBenchPlayerDisabled(includedPlayers, selectedPlayer)
                )
            "
            :action="showBenchBtn ? 'remove' : 'add'"
            @move="(action) => $emit('move', action)"
            @scores-fetched="footballStore.getPlayer(selectedPlayer!.id)"
        />

        <PlayerDialog
            v-model="showPlayerDialog"
            :editable="false"
            :player="playerDetailed"
            @scores-fetched="footballStore.getPlayer(selectedPlayer!.id)"
        />
    </div>
</template>

<style scoped>
.pad {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 8px;
    justify-content: space-between;
    position: relative;
    max-width: 600px;
    margin: 0 auto;

    .players-layer {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        padding: 2px 6px 12px;
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
    background-image: url('../../assets/football-pitch-green.png');
    background-size: 100% 100%;
    position: relative;

    .loading {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: rgba(0, 0, 0, 0.5);
        color: white;
    }
}
</style>

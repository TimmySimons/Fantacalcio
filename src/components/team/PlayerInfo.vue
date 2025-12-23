<script setup lang="ts">
import ShieldIcon from '../../assets/icons/soccer-shield.svg';
import CaretIcon from '../../assets/icons/caret.svg';
import PlayerDialog from '../../pages/admin/dialogs/PlayerDialog.vue';
import { ref } from 'vue';
import type { PlayerContract } from '../../model/player.contract.ts';

defineProps<{
    selectedPlayer?: PlayerContract;
    canMove: boolean;
    action: 'add' | 'remove';
}>();

defineEmits<{
    (e: 'move', action: 'add' | 'remove'): void;
}>();

const showPlayerDialog = ref(false);
</script>

<template>
    <div class="player-info" v-if="selectedPlayer">
        <PlayerDialog v-model="showPlayerDialog" :editable="false" :player="selectedPlayer" />

        <div class="player-img-wrapper" @click="showPlayerDialog = true">
            <img
                v-if="selectedPlayer?.picture_url"
                :src="selectedPlayer.picture_url"
                class="player-img"
            />
            <component v-else :is="ShieldIcon" class="svg" />
        </div>

        <div class="info">
            <div>{{ selectedPlayer.first_name + ' ' + selectedPlayer.last_name }}</div>
            <div>{{ selectedPlayer.position }}</div>
            <div class="home">{{ selectedPlayer.club_name_short }}</div>
            <div v-if="selectedPlayer.PlayersAwayTeams" class="away">
                <i class="pi pi-arrows-h" />
                {{ selectedPlayer.PlayersAwayTeams[0]?.away_team }}
            </div>
        </div>
        <div
            v-if="canMove"
            class="move"
            :class="{ remove: action === 'remove' }"
            @click="$emit('move', action)"
        >
            <component :is="CaretIcon" class="svg" />
        </div>
    </div>
</template>

<style scoped>
.player-info {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    height: 66px;
    width: 96%;
    display: flex;
    align-items: start;
    padding: 4px;
    box-sizing: border-box;
    font-size: 0.7em;
    gap: 8px;
    background: #50945feb;
    border: 1px solid #0b6e1547;
    border-radius: 6px;
    color: #fff;
    font-weight: bold;
    box-shadow: 0px 3px 6px 0px rgb(0 0 0 / 39%);

    .player-img-wrapper {
        height: 56px;
        width: 60px;
        background: rgba(0, 0, 0, 0.2);
        padding: 4px 4px 0 4px;
        box-sizing: border-box;
        border-radius: 6px;

        .player-img {
            height: 100%;
            width: auto;
        }
    }

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
        font-size: 9px;

        .away {
            color: #093400;
            display: flex;
            align-items: center;
            gap: 4px;
            i {
                font-size: 11px;
            }
            border: 1px solid rgba(15, 39, 0, 0.27);
            padding: 0 6px;
            border-radius: 2px;
            width: fit-content;
            margin-top: 2px;
        }

        > div {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 150px;
        }
    }

    .scores,
    .move {
        height: 100%;
        min-width: 56px;
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

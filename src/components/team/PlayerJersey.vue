<script setup lang="ts">
import JerseyIcon from '../../assets/icons/jersey-full.svg';
import { type PlayerContract, type PlayerWithScoreContract } from '../../model/player.contract.ts';
import { computed } from 'vue';
import { useFootballStore } from '../../stores/football.store.ts';
import { storeToRefs } from 'pinia';
import { FootballUtil } from '../../FootballUtil.ts';

const footballStore = useFootballStore();
const { gameweek } = storeToRefs(footballStore);

const props = defineProps<{
    player: PlayerWithScoreContract;
    selectedPlayer: PlayerContract | undefined;
    includedPlayers?: PlayerContract[];
    isFullyDisabled?: boolean;
    showPoints?: boolean;
}>();

const emit = defineEmits<{
    (e: 'click', player: PlayerContract | undefined): void;
}>();

const onClickPlayer = (player: PlayerContract) => {
    if (props.selectedPlayer?.id === player.id) {
        emit('click', undefined);
    } else {
        emit('click', player);
    }
};

const isDisabled = computed(() => {
    return FootballUtil.isSelectedBenchPlayerDisabled(props.includedPlayers, props.player);
});

const awayTeam = computed(() => {
    return props.player.PlayersAwayTeams?.[0]?.away_team;
});
</script>

<template>
    <div
        class="player"
        :class="[
            { selected: player.id === selectedPlayer?.id },
            player.position,
            { disabled: isDisabled }
        ]"
        @click.stop="onClickPlayer(player)"
    >
        <div class="position" :class="player.position">{{ player.position[0] }}</div>

        <img v-if="player?.picture_url" :src="player.picture_url" class="player-img" />
        <component v-else :is="JerseyIcon" class="svg" />
        <span class="name">{{ player.last_name || player.first_name }}</span>
        <span v-if="awayTeam" class="name away-team">{{ awayTeam }}</span>
        <div v-if="showPoints" class="points-wrapper">
            <div class="points gw">
                <span v-if="!!gameweek?.scores_published_date && !!player.score"
                    >+{{ Math.round(player.score) }}</span
                >
                <span v-else>-</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.player {
    min-height: 58px;
    width: 58px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    .position {
        position: absolute;
        top: 0;
        left: 7px;
        font-size: 0.5em;
        font-weight: bold;
        color: white;
        background: #032539;
        width: 10px;
        height: 10px;
        justify-content: center;
        align-items: center;
        border-radius: 10%;
        display: none;

        &.Goalkeeper {
            background: #032539;
        }
        &.Defender {
            background: #008a27;
        }
        &.Midfielder {
            background: #7d00bd;
        }
        &.Forward {
            background: #bd4200;
        }
    }

    .svg {
        min-height: 42px;
        min-width: 42px;
        fill: #032539;
    }

    .player-img {
        height: 42px;
        width: 42px;
    }

    .name {
        font-size: 0.5em;
        font-weight: bold;
        text-align: center;
        line-height: 1.2em;
        word-break: break-word;
        background: #000000a3;
        color: white;
        padding: 1px 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        min-width: 60px;
        max-width: 60px;
        border-radius: 2px 2px 0 0;

        &.away-team {
            font-size: 6px;
            background: #ffffffc3;
            color: black;
            padding: 1px 2px;
            font-weight: 600;
            border-radius: 0 0 2px 2px;
        }
    }

    &.selected {
        .svg {
            fill: darkred;
        }
    }

    &.disabled {
        opacity: 0.7;

        .svg {
            fill: #ccc;
        }

        .player-img {
            filter: grayscale(100%);
        }
    }
}

.Goalkeeper {
    .svg {
        fill: #00072e;
    }
}

.Defender {
    .svg {
        fill: #0d1d70;
    }
}

.Midfielder {
    .svg {
        fill: #26429e;
    }
}

.Forward {
    .svg {
        fill: #597ecd;
    }
}

.hidden {
    opacity: 0;
}

.grid {
    .position-group .player {
        min-height: unset;
    }
}

.points-wrapper {
    display: flex;
    gap: 2px;
    margin-top: 1px;
}

.points {
    background: white;
    min-width: 30px;
    text-align: center;
    border-radius: 4px;
    font-size: 0.7em;
    font-weight: bold;

    &.total {
        background: #af9595;
        color: #fff;
    }
}

.points-inline {
    .points-wrapper {
        display: flex;
        gap: 1px;

        .points {
            font-size: 0.6em;
            min-width: 30px;
        }
    }

    .substitutes {
        .points-wrapper {
            left: 30%;
            top: 3px;
        }

        .points.gw {
            background: #e4e4e4;
        }
    }
}

.substitutes {
    .position {
        display: flex;
    }

    .name {
        &.away-team {
            background: #eaeaea;
        }
    }
}
</style>

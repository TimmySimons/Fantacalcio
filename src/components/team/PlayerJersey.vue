<script setup lang="ts">
import JerseyIcon from '../../assets/icons/jersey-full.svg';
import { type PlayerContract, PlayerPosition } from '../../model/player.contract.ts';
import { computed } from 'vue';

const props = defineProps<{
    player: PlayerContract;
    selectedPlayer: PlayerContract | undefined;
    includedPlayers?: PlayerContract[];
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
    if (!props.includedPlayers) return false;
    if (props.includedPlayers.length >= 11) return true;
    if (
        !props.includedPlayers.find((p) => p.position === PlayerPosition.Goalkeeper) &&
        props.player.position !== PlayerPosition.Goalkeeper &&
        props.includedPlayers.length >= 10
    ) {
        return true;
    }

    const includedPlayersOfType = props.includedPlayers.filter(
        (p) => p.position === props.player.position
    );

    if (props.player.position === 'Goalkeeper') {
        if (includedPlayersOfType.length >= 1) return true;
    } else if (includedPlayersOfType.length >= 4) return true;

    return false;
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
        <component :is="JerseyIcon" class="svg" />
        <span class="name">{{ player.last_name }}</span>
    </div>
</template>

<style scoped>
.player {
    min-height: 58px;
    width: 58px;
}

.player {
    display: flex;
    flex-direction: column;
    align-items: center;

    .svg {
        min-height: 46px;
        min-width: 46px;
        fill: #032539;
    }

    .name {
        font-size: 0.6em;
        font-weight: bold;
        text-align: center;
        line-height: 1.2em;
        word-break: break-word;
    }

    &.selected {
        .svg {
            fill: darkred;
        }
    }

    &.disabled {
        .svg {
            fill: #ccc;
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
</style>

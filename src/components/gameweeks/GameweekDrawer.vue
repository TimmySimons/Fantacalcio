<script setup lang="ts">
import type { GameweekContract } from '../../model/gameweek.contract.ts';
import { useFootballStore } from '../../stores/football.store.ts';
import { FootballUtil } from '../../FootballUtil.ts';

defineProps<{
    gameweeks: GameweekContract[];
}>();

const showDrawer = defineModel<boolean>({ required: false, default: false });

const footballStore = useFootballStore();

const onSelectGameweek = (gw: GameweekContract) => {
    footballStore.gameweekTeam = undefined;
    footballStore.getGameweek(gw.id).then(() => (showDrawer.value = false));
};
</script>

<template>
    <Drawer v-model:visible="showDrawer" header="Gameweeks">
        <div class="gw-list">
            <div
                v-for="gameweek in [...gameweeks].sort((a, b) => b.week - a.week)"
                :key="gameweek.id"
                class="gw"
                :class="{ current: FootballUtil.isCurrentGameweek(gameweek) }"
                @click="onSelectGameweek(gameweek)"
            >
                Gameweek {{ gameweek.week }}
                <div v-if="FootballUtil.isCurrentGameweek(gameweek)" class="now">Now playing!</div>
            </div>
        </div>
    </Drawer>
</template>

<style scoped>
.gw-list {
    display: flex;
    flex-direction: column;
    align-items: center;

    .gw {
        border-bottom: 1px solid #c8c8c8;
        width: 100%;
        text-align: center;
        padding: 12px;

        &:active {
            background-color: white;
            transform: scale(0.98);
        }

        &.current {
            color: darkred;
            font-weight: bold;

            .now {
                font-size: 0.6em;
            }
        }
    }
}
</style>

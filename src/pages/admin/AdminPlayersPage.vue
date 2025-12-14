<script setup lang="ts">
import { ref } from 'vue';
import PlayerDialog from './dialogs/PlayerDialog.vue';
import PlayerCard from '../../components/admin/players/PlayerCard.vue';
import { useAdminStore } from '../../stores/admin.store.ts';
import { storeToRefs } from 'pinia';
import { SorareApi } from '../../sorare/sorare.api.ts';

const adminStore = useAdminStore();
const { players, goalkeepers, defenders, midfielders, forwards, player } = storeToRefs(adminStore);

adminStore.getPlayers();

const showDialog = ref(false);

const onClickPlayer = async (playerId: string) => {
    player.value = undefined;
    await adminStore.getPlayer(playerId);
    showDialog.value = true;
};

const isLoadingSorare = ref(false);

const onSave = async (sorareSlug: string) => {
    isLoadingSorare.value = true;
    await SorareApi.getPlayerStats(sorareSlug).then((sorareData) => {
        if (player.value) {
            adminStore.updatePlayer(player.value.id, sorareSlug, sorareData).then(() => {
                adminStore.getPlayers();
                adminStore.getPlayer(player.value!.id);
            });
        } else {
            adminStore.createPlayer(sorareSlug, sorareData).then(() => {
                adminStore.getPlayers();
            });
        }
    });

    isLoadingSorare.value = false;
};

const onNewPlayer = () => {
    player.value = undefined;
    showDialog.value = true;
};
</script>

<template>
    <div class="wrapper">
        <div class="title flex items-center">
            Players ({{ players?.length }})
            <div class="flex justify-end">
                <Button label="New Player" @click="onNewPlayer" class="new-btn" />
            </div>
        </div>
        <div class="wrapper inner">
            <PlayerDialog
                v-model="showDialog"
                :editable="true"
                :player="player"
                @save="onSave"
                :is-loading-sorare="isLoadingSorare"
            />

            <div v-if="players" class="players">
                <Fieldset :toggleable="true" :legend="`Goalkeepers (${goalkeepers.length})`">
                    <div class="flex col gap-4">
                        <PlayerCard
                            v-for="player in goalkeepers"
                            :key="player.id"
                            :player="player"
                            @click="onClickPlayer(player.id)"
                        />
                    </div>
                </Fieldset>

                <Divider type="solid" />

                <Fieldset :toggleable="true" :legend="`Defenders (${defenders.length})`">
                    <div class="flex col gap-4">
                        <PlayerCard
                            v-for="player in defenders"
                            :key="player.id"
                            :player="player"
                            @click="onClickPlayer(player.id)"
                        />
                    </div>
                </Fieldset>

                <Divider type="solid" />

                <Fieldset :toggleable="true" :legend="`Midfielders (${midfielders.length})`">
                    <div class="flex col gap-4">
                        <PlayerCard
                            v-for="player in midfielders"
                            :key="player.id"
                            :player="player"
                            @click="onClickPlayer(player.id)"
                        />
                    </div>
                </Fieldset>

                <Divider type="solid" />

                <Fieldset :toggleable="true" :legend="`Forwards (${forwards.length})`">
                    <div class="flex col gap-4">
                        <PlayerCard
                            v-for="player in forwards"
                            :key="player.id"
                            :player="player"
                            @click="onClickPlayer(player.id)"
                        />
                    </div>
                </Fieldset>
            </div>

            <div v-else>
                <i class="pi pi-spin pi-spinner" style="font-size: 12px"></i> Loading...
            </div>
        </div>
    </div>
</template>

<style scoped>
.title {
    justify-content: space-between;
}

.wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;

    .players {
        height: 100%;
        display: flex;
        flex-direction: column;
        min-height: 0;
        gap: 6px;
        overflow-y: auto;
    }

    .section-header {
        font-size: 0.9em;
        font-weight: bold;
        position: sticky;
        top: 0;
        padding: 0 0 8px 0;
        background: whitesmoke;

        &:first-child {
            margin-top: 0;
        }
    }
}
</style>

<script setup lang="ts">
import { useAdminStore } from '../../stores/admin.store.ts';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import GameweekDialog from './dialogs/GameweekDialog.vue';
import type { GameweekContract } from '../../model/gameweek.contract.ts';
import { useRouter } from 'vue-router';
import Fieldset from 'primevue/fieldset';
import Divider from 'primevue/divider';
import GameweekCard from '../../components/gameweeks/GameweekCard.vue';
import { useToast } from 'primevue';

const adminStore = useAdminStore();
const { gameweeks, currentGameweek } = storeToRefs(adminStore);
const toast = useToast();

adminStore.getGameweeks();

const showDialog = ref(false);

const router = useRouter();

const onSelect = (gameweek: GameweekContract) => {
    router.push({ name: 'AdminGameweek', params: { id: gameweek.id } });
};

const pastGameweeks = computed(() => gameweeks.value?.filter((gw) => gw.end_date < new Date()));
const futureGameweeks = computed(() => gameweeks.value?.filter((gw) => gw.end_date >= new Date()));

const isLoadingNewGameweeks = ref(false);
const onLoadGameweeks = async () => {
    isLoadingNewGameweeks.value = true;
    const newGws = await adminStore.loadSorareGameweeks();
    await adminStore.getGameweeks(true);

    toast.add({
        severity: newGws === 0 ? 'info' : 'success',
        summary: newGws === 0 ? 'Nothing to add' : 'Added new gameweeks.',
        detail: `Found ${newGws} new gameweek(s).`,
        life: 5000
    });

    isLoadingNewGameweeks.value = false;
};
</script>

<template>
    <div class="flex-col">
        <div class="title flex items-center">Gameweeks</div>

        <GameweekDialog v-model="showDialog" />

        <div class="flex-col wrapper">
            <Fieldset
                :toggleable="true"
                collapsed
                :legend="`Past Gameweeks (${pastGameweeks?.length ?? 0})`"
            >
                <div class="flex col flex-col gap-8 gws">
                    <div
                        v-for="gameweek in pastGameweeks"
                        :key="gameweek.id"
                        @click="onSelect(gameweek)"
                    >
                        <GameweekCard :gameweek="gameweek" :current-gameweek="currentGameweek" />
                    </div>
                </div>
            </Fieldset>
            <Divider type="solid" />
            <Fieldset
                :toggleable="true"
                :legend="`Future Gameweeks (${futureGameweeks?.length ?? 0})`"
            >
                <div class="flex col flex-col gap-8 gws">
                    <div
                        v-for="gameweek in futureGameweeks"
                        :key="gameweek.id"
                        @click="onSelect(gameweek)"
                    >
                        <GameweekCard :gameweek="gameweek" :current-gameweek="currentGameweek" />
                    </div>

                    <Button
                        label="Load More Gameweeks"
                        :icon="isLoadingNewGameweeks ? 'pi pi-spinner pi-spin' : 'pi pi-plus'"
                        @click="onLoadGameweeks"
                        :disabled="isLoadingNewGameweeks"
                    />
                </div>
            </Fieldset>
        </div>
    </div>
</template>

<style scoped>
.title {
    justify-content: space-between;
}

.wrapper {
    overflow-y: auto;
}
</style>

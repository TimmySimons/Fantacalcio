<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { PlayerPosition } from '../../../model/player.contract.ts';
import type { AppUserContract } from '../../../model/app-user.contract.ts';
import { useAdminStore } from '../../../stores/admin.store.ts';
import { storeToRefs } from 'pinia';
import SelectablePlayerGroup from '../../../components/admin/SelectablePlayerGroup.vue';
import { useToast } from 'primevue';

const props = defineProps<{
    manager: AppUserContract;
}>();

const showDialog = defineModel<boolean>({ required: false, default: false });

const adminStore = useAdminStore();
const { players, managerPlayers } = storeToRefs(adminStore);
const toast = useToast();

const isLoading = ref(false);

const selectedGoalkeepers = ref<string[]>([]);
const selectedDefenders = ref<string[]>([]);
const selectedMidfielders = ref<string[]>([]);
const selectedForwards = ref<string[]>([]);

const allSelectedPlayers = computed(() => [
    ...selectedGoalkeepers.value,
    ...selectedDefenders.value,
    ...selectedMidfielders.value,
    ...selectedForwards.value
]);

const selectedCount = computed(() => allSelectedPlayers.value.length);

watch(
    showDialog,
    async (show) => {
        if (show) {
            isLoading.value = true;
            await Promise.all([
                adminStore.getPlayers(),
                adminStore.getManagerPlayers(props.manager.id)
            ]);

            selectedGoalkeepers.value =
                managerPlayers.value
                    ?.filter((p) => p.position === PlayerPosition.Goalkeeper)
                    ?.map((p) => p.id) ?? [];
            selectedDefenders.value =
                managerPlayers.value
                    ?.filter((p) => p.position === PlayerPosition.Defender)
                    .map((p) => p.id) ?? [];
            selectedMidfielders.value =
                managerPlayers.value
                    ?.filter((p) => p.position === PlayerPosition.Midfielder)
                    .map((p) => p.id) ?? [];
            selectedForwards.value =
                managerPlayers.value
                    ?.filter((p) => p.position === PlayerPosition.Forward)
                    .map((p) => p.id) ?? [];

            isLoading.value = false;
        }
    },
    { immediate: true }
);

const search = ref('');

const filterPlayers = (list: typeof players.value) => {
    const q = search.value.toLowerCase();
    return (list ?? []).filter((p) =>
        `${p.first_name} ${p.last_name ?? ''}`.toLowerCase().includes(q)
    );
};

const goalKeepers = computed(
    () => players.value?.filter((p) => p.position === PlayerPosition.Goalkeeper)
);
const defenders = computed(
    () => players.value?.filter((p) => p.position === PlayerPosition.Defender)
);
const midfielders = computed(
    () => players.value?.filter((p) => p.position === PlayerPosition.Midfielder)
);
const forwards = computed(
    () => players.value?.filter((p) => p.position === PlayerPosition.Forward)
);

const onSave = async () => {
    await adminStore
        .updateManagerPlayers(props.manager.id, allSelectedPlayers.value)
        .then(() => adminStore.getManagers());
    showDialog.value = false;
    toast.add({
        severity: 'success',
        summary: 'Saved',
        detail: `${props.manager.team_name} updated successfully.`,
        life: 3000
    });
};
</script>

<template>
    <Dialog
        v-model:visible="showDialog"
        modal
        :header="`${manager.team_name}`"
        :style="{ width: '96%', height: '100%' }"
    >
        <div class="flex col dialog-body">
            <div v-if="isLoading" class="content flex col">
                <div><i class="pi pi-spin pi-spinner" style="font-size: 12px"></i> Loading</div>
            </div>
            <div v-else class="content-wrapper flex col">
                <div class="total">
                    Total players: <span>{{ selectedCount }}</span>
                </div>

                <IconField class="search">
                    <InputIcon class="pi pi-search" />
                    <InputText v-model="search" placeholder="Search players..." />
                </IconField>

                <div class="content flex col">
                    <SelectablePlayerGroup
                        :title="'Goalkeepers'"
                        :players="filterPlayers(goalKeepers)"
                        v-model="selectedGoalkeepers"
                    />

                    <SelectablePlayerGroup
                        :title="'Defenders'"
                        :players="filterPlayers(defenders)"
                        v-model="selectedDefenders"
                    />

                    <SelectablePlayerGroup
                        :title="'Midfielders'"
                        :players="filterPlayers(midfielders)"
                        v-model="selectedMidfielders"
                    />

                    <SelectablePlayerGroup
                        :title="'Forwards'"
                        :players="filterPlayers(forwards)"
                        v-model="selectedForwards"
                    />
                </div>
            </div>

            <div class="flex justify-end gap-8 buttons">
                <Button type="button" label="Save" @click="onSave"></Button>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.dialog-body {
    height: 100%;
    box-sizing: border-box;
    min-height: 0;

    .content-wrapper {
        min-height: 0;
        gap: 24px;
    }

    .content {
        overflow-y: auto;
        height: 100%;
        box-sizing: border-box;
        flex: 1;
        min-height: 0;
        margin-bottom: 24px;
        gap: 24px;
    }
}

.total {
    padding: 6px 12px;
    background: #f2f2f2;
    border-radius: 6px;
    font-weight: bold;
    font-size: 14px;
    color: #6c757d;
}

.search {
    width: 100%;

    input {
        width: 100%;
    }
}
</style>

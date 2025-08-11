<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref } from 'vue';
import { FootballApi } from '../../supabase/football.api.ts';
import { useToast } from 'primevue';

defineProps<{}>();

const players = ref<{ id: string; name: string }[] | null>(null);

FootballApi.getPlayers().then((t) => {
    players.value = t;
});

const toast = useToast();
const editingRows = ref([]);
const selectedItems = ref([]);
const deleteItemDialog = ref(false);
const deleteItemsDialog = ref(false);
const player = ref<{ id: string; name: string } | null>(null);

const onRowEditSave = (event: any) => {
    console.log(event);
};

const positions = ref([
    { label: 'Goalkeeper', value: 'Goalkeeper' },
    { label: 'Defender', value: 'Defender' },
    { label: 'Midfielder', value: 'Midfielder' },
    { label: 'Attacker', value: 'Attacker' }
]);

const getPositionLabel = (status: string) => {
    switch (status) {
        case 'Goalkeeper':
            return 'success';

        case 'Defender':
            return 'info';

        case 'Midfielder':
            return 'warn';

        case 'Attacker':
            return 'danger';

        default:
            return 'info';
    }
};

const openNew = () => {};
const confirmDeleteSelected = () => {
    deleteItemsDialog.value = true;
};

const deletePlayer = () => {
    if (player.value) {
        players.value = players.value?.filter((val) => val.id !== player.value!.id) ?? [];
        deleteItemDialog.value = false;
        player.value = null;
        toast.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Player Deleted',
            life: 2000
        });
    }
};
</script>

<template>
    <div class="wrapper">
        <Toolbar class="mb-6">
            <template #end>
                <div class="button-wrapper">
                    <Button
                        label="New"
                        icon="pi pi-plus"
                        class="mr-2"
                        severity="danger"
                        @click="openNew"
                    />
                    <Button
                        label="Delete"
                        icon="pi pi-trash"
                        severity="danger"
                        variant="outlined"
                        @click="confirmDeleteSelected"
                        :disabled="!selectedItems || !selectedItems.length"
                    />
                </div>
            </template>
        </Toolbar>

        <DataTable
            :value="players"
            sort-field="name"
            dataKey="id"
            @row-edit-save="onRowEditSave"
            v-model:editingRows="editingRows"
            v-model:selection="selectedItems"
            scrollable
            scrollHeight="flex"
            size="small"
        >
            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
            <Column field="name" header="Name" sortable>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
            <Column field="position" header="Position" sortable>
                <template #body="slotProps">
                    <Tag
                        :value="slotProps.data.position"
                        :severity="getPositionLabel(slotProps.data.position)"
                    />
                </template>
                <template #editor="{ data, field }">
                    <Select
                        v-model="data[field]"
                        :options="positions"
                        optionLabel="label"
                        optionValue="value"
                        placeholder="Select a Position"
                        fluid
                    >
                        <template #option="slotProps">
                            <Tag
                                :value="slotProps.option.value"
                                :severity="getPositionLabel(slotProps.option.value)"
                            />
                        </template>
                    </Select>
                </template>
            </Column>
            <Column field="club" header="Club" sortable>
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
        </DataTable>
    </div>
    <Dialog
        v-model:visible="deleteItemDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
    >
        <div class="flex items-center gap-4">
            <i class="pi pi-exclamation-triangle !text-3xl" />
            <span v-if="player"
                >Are you sure you want to delete <b>{{ player.name }}</b
                >?</span
            >
        </div>
        <template #footer>
            <Button
                label="No"
                icon="pi pi-times"
                text
                @click="deleteItemDialog = false"
                severity="secondary"
                variant="text"
            />
            <Button label="Yes" icon="pi pi-check" @click="deletePlayer" severity="danger" />
        </template>
    </Dialog>
</template>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
}

.button-wrapper {
    display: flex;
    gap: 12px;
}
</style>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { BasePlayerContract } from '../../../model/player.contract.ts';
import { FootballApi } from '../../../supabase/football.api.ts';

const props = defineProps<{
    player: BasePlayerContract;
    teamPlayerId: number;
    score?: number | undefined;
}>();

const showDialog = defineModel<boolean>({ required: false, default: false });

const emit = defineEmits<{
    (e: 'scored'): void;
}>();

const overrideScore = ref();

watch(
    showDialog,
    (show) => {
        if (show) {
            overrideScore.value = props.score;
        }
    },
    { immediate: true }
);

const onSave = () => {
    const update = { id: props.teamPlayerId, score: overrideScore.value || null };

    FootballApi.updateGameweekPlayerScoreOverride(update).then(async () => {
        emit('scored');
    });

    showDialog.value = false;
};
</script>

<template>
    <Dialog v-model:visible="showDialog" modal header="Override Score">
        <div class="info">
            <b>{{ player.first_name }} {{ player.last_name }}</b>
        </div>

        <div class="flex col gap-8">
            <div class="flex gap-8 items-center">
                <label for="number" class="font-semibold w-24">Score</label>
                <InputText
                    id="number"
                    class="flex-auto"
                    autocomplete="off"
                    type="number"
                    v-model="overrideScore"
                />
            </div>

            <div class="flex justify-end gap-8 buttons">
                <Button
                    type="button"
                    label="Cancel"
                    severity="secondary"
                    @click="showDialog = false"
                ></Button>
                <Button type="button" label="Save" @click="onSave"></Button>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
label {
    min-width: 40px;
}

.buttons {
    margin-top: 12px;
}

.info {
    margin-bottom: 12px;
}

input {
    width: 100%;
}
</style>

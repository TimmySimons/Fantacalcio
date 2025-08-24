<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import dayjs from 'dayjs';
import type { GameweekContract } from '../../../model/gameweek.contract.ts';

const props = defineProps<{
    prevGameweek: GameweekContract | undefined;
}>();

const showDialog = defineModel<boolean>({ required: false, default: false });

const number = ref();
const year = ref();
const startDate = ref(new Date());
const endDate = ref(new Date());

watch(
    showDialog,
    (show) => {
        if (show) {
            number.value = (props.prevGameweek?.week ?? 0) + 1;
            year.value = new Date().getFullYear();
            startDate.value = suggestedStartDate.value;
            endDate.value = dayjs(suggestedStartDate.value).add(6, 'days').toDate();
        }
    },
    { immediate: true }
);

const suggestedStartDate = computed(() =>
    props.prevGameweek ? dayjs(props.prevGameweek.end_date).add(1, 'day').toDate() : new Date()
);
</script>

<template>
    <Dialog v-model:visible="showDialog" modal header="New Gameweek">
        <div class="flex col gap-8">
            <div class="flex gap-8 items-center">
                <label for="number" class="font-semibold w-24">#</label>
                <InputText
                    id="number"
                    class="flex-auto"
                    autocomplete="off"
                    type="number"
                    v-model="number"
                />
            </div>
            <div class="flex items-center gap-8">
                <label for="year" class="font-semibold w-24">Year</label>
                <InputText
                    id="year"
                    class="flex-auto"
                    autocomplete="off"
                    type="number"
                    v-model="year"
                />
            </div>
            <div class="flex items-center gap-8">
                <label for="year" class="font-semibold w-24">Start</label>
                <DatePicker
                    v-model="startDate"
                    dateFormat="dd-mm-yy"
                    showIcon
                    fluid
                    iconDisplay="input"
                    showTime
                />
            </div>
            <div class="flex items-center gap-8">
                <label for="year" class="font-semibold w-24">End</label>
                <DatePicker
                    v-model="endDate"
                    dateFormat="dd-mm-yy"
                    showIcon
                    fluid
                    iconDisplay="input"
                    showTime
                />
            </div>
            <div class="flex justify-end gap-8 buttons">
                <Button
                    type="button"
                    label="Cancel"
                    severity="secondary"
                    @click="showDialog = false"
                ></Button>
                <Button type="button" label="Save" @click="showDialog = false"></Button>
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

.new-btn {
    margin: 12px 0;
}

input {
    width: 100%;
}
</style>

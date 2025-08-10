<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

defineProps<{
    items: any[];
}>();
</script>

<template>
    <DataTable :value="items" sort-field="name">
        <Column field="name" header="Name" sortable></Column>
        <Column field="position" header="Position" sortable></Column>
        <Column field="club" header="Club" sortable></Column>
    </DataTable>
</template>

<style scoped></style>

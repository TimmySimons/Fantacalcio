<script setup lang="ts">
defineProps<{
    label: string;
    to: string;
}>();
</script>

<template>
    <div class="tile">
        <RouterLink :to="to" class="link">{{ label }}</RouterLink>
    </div>
</template>

<style scoped>
.tile {
    height: 100px;
    width: 100%;
    border: 1px solid lightgray;
    border-radius: 8px;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 450px;

    .link {
        color: inherit;
        text-decoration: none;
    }
}
</style>

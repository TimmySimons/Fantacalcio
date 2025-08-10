<script setup lang="ts">
import AppTabMenu from './AppTabMenu.vue';

const items = [
    { label: 'Leaderboard', route: { name: 'Home' }, icon: 'pi pi-fw pi-trophy' },
    { label: 'My Team', route: { name: 'ManageTeam' }, icon: 'pi pi-fw pi-sitemap' }
];
</script>

<template>
    <div class="footer">
        <AppTabMenu :items="items" />
    </div>
</template>

<style scoped></style>

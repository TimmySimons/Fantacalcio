<script setup lang="ts">
import AppTabMenu from './AppTabMenu.vue';

const items = [
    { label: 'Leaderboard', route: { name: 'Leaderboard' }, icon: 'pi pi-fw pi-trophy' },
    { label: 'My Team', route: { name: 'ManageTeam' }, icon: 'pi pi-fw pi-sitemap' },
    { label: 'Admin', route: { name: 'Admin' }, icon: 'pi pi-fw pi-cog' }
];
</script>

<template>
    <div class="footer">
        <AppTabMenu :items="items" />
    </div>
</template>

<style scoped></style>

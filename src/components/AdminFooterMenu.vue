<script setup lang="ts">
import AppTabMenu from './AppTabMenu.vue';

const items = [
    { label: 'Gameweeks', route: { name: 'AdminGameweeks' }, icon: 'pi pi-fw pi-calendar' },
    { label: 'Managers', route: { name: 'AdminManagers' }, icon: 'pi pi-fw pi-user-edit' },
    { label: 'Players', route: { name: 'AdminPlayers' }, icon: 'pi pi-fw pi-users' }
];
</script>

<template>
    <div class="footer">
        <AppTabMenu :items="items" />
    </div>
</template>

<style scoped></style>

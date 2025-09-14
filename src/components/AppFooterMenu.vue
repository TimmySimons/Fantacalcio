<script setup lang="ts">
import AppTabMenu from './AppTabMenu.vue';
import { computed } from 'vue';
import { useAuthStore } from '../stores/auth.store.ts';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { appUser } = storeToRefs(authStore);

const items = computed(() => {
    const i = [
        { label: 'Leaderboard', route: { name: 'Leaderboard' }, icon: 'pi pi-fw pi-trophy' },
        { label: 'My Team', route: { name: 'ManageTeam' }, icon: 'pi pi-fw pi-sitemap' }
    ];

    if (appUser.value?.roles.includes('ADMIN')) {
        i.push({ label: 'Admin', route: { name: 'Admin' }, icon: 'pi pi-fw pi-cog' });
    }

    return i;
});
</script>

<template>
    <div class="footer">
        <AppTabMenu :items="items" />
    </div>
</template>

<style scoped></style>

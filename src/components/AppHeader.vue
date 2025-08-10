<script setup lang="ts">
import Menubar from 'primevue/menubar';

const items = [
    { label: 'Leaderboard', route: { name: 'Home' }, icon: 'pi pi-fw pi-trophy' },
    { label: 'My Team', route: { name: 'ManageTeam' }, icon: 'pi pi-fw pi-sitemap' },
    { label: 'Admin', route: { name: 'Admin' }, icon: 'pi pi-fw pi-cog' }
];
</script>

<template>
    <Menubar :model="items" :router="true">
        <template #start>
            <div class="start">
                <img alt="logo" src="/pwa-192x192.png" height="40" class="mr-2" />
                <span class="text-xl font-bold name">Fantacalcio</span>
            </div>
        </template>

        <template #item="{ item, props }">
            <RouterLink v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                <a :href="href" v-bind="props.action" @click="navigate">
                    <span :class="item.icon" />
                    <span class="ml-2">{{ item.label }}</span>
                </a>
            </RouterLink>
        </template>
    </Menubar>
</template>

<style scoped>
.start {
    display: flex;
    align-items: center;
    gap: 12px;
}

.name {
    color: darkred;
}
</style>

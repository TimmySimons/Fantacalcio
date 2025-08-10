<script setup lang="ts">
import { useRouter } from 'vue-router';
import Menubar from 'primevue/menubar';

const router = useRouter();

const goLogin = () => {
    router.push({ name: 'Login' });
};

const items = [
    { label: 'Leaderboard', route: { name: 'Home' }, icon: 'pi pi-fw pi-trophy' },
    { label: 'My Team', route: { name: 'ManageTeam' }, icon: 'pi pi-fw pi-sitemap' },
    { label: 'Admin', route: { name: 'Admin' }, icon: 'pi pi-fw pi-cog' }
    // {
    //     label: 'Admin',
    //     icon: 'pi pi-fw pi-ellipsis-h',
    //     items: [
    //         { label: 'Players', icon: 'pi pi-cog', to: '/admin/players' },
    //         { label: 'Gameweeks', icon: 'pi pi-question', to: '/admin/gameweeks' }
    //     ]
    // }
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

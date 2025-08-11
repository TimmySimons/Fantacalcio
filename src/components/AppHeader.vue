<script setup lang="ts">
import Menubar from 'primevue/menubar';
</script>

<template>
    <Menubar :model="[]" :router="true">
        <template #start>
            <div class="start">
                <img alt="logo" src="/pwa-192x192.png" height="40" class="mr-2" />
                <span class="text-xl font-bold name">Fantacalcio</span>
            </div>
        </template>

        <template #end>
            <slot name="end">
                <RouterLink :to="{ name: 'Admin' }" class="link">
                    <i class="pi pi-cog" style="font-size: 1.2rem"></i>
                </RouterLink>
            </slot>
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
    font-weight: bold;
}

.pi {
    color: #64748b;
    margin-top: 4px;
}
</style>

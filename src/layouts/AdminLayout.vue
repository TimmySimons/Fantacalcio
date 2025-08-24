<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
import AdminFooterMenu from '../components/AdminFooterMenu.vue';
</script>

<template>
    <div class="full-page admin">
        <AppHeader>
            <template #end>
                <RouterLink :to="{ name: 'Home' }" class="link">
                    <i class="pi pi-arrow-circle-left" style="font-size: 1.6rem"></i>
                </RouterLink>
            </template>
        </AppHeader>
        <div class="page-container custom-scrollbar">
            <div class="page-content">
                <div class="content">
                    <slot>
                        <RouterView />
                    </slot>
                </div>
            </div>
        </div>
        <AdminFooterMenu />
    </div>
</template>

<style scoped>
.full-page {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.page-container {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-direction: column;
    padding: 18px;
    box-sizing: border-box;

    .page-content {
        height: 100%;
        min-height: 0;
        display: flex;
        flex-direction: column;
    }
}

.content {
    height: 100%;
}

.pi {
    color: #64748b;
    margin-top: 4px;
}
</style>

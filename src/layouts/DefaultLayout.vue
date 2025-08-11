<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue';
import AppFooterMenu from '../components/AppFooterMenu.vue';
</script>

<template>
    <div class="full-page">
        <AppHeader />
        <div class="page-container custom-scrollbar">
            <div class="page-content">
                <slot>
                    <RouterView />
                </slot>
            </div>
        </div>
        <AppFooterMenu />
    </div>
</template>

<style scoped>
.full-page {
    height: 100dvh;
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
    box-sizing: border-box;
    overflow-y: auto;

    .page-content {
        height: 100%;
        min-height: 0;
        display: flex;
        flex-direction: column;
    }
}
</style>

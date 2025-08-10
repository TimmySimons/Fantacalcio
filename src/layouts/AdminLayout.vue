<script setup lang="ts">
import DefaultLayout from './DefaultLayout.vue';
import AppTabMenu from '../components/AppTabMenu.vue';
import AppHeader from '../components/AppHeader.vue';
import AdminFooterMenu from '../components/AdminFooterMenu.vue';

const items = [
    { label: 'Gameweeks', route: { name: 'AdminGameweeks' }, icon: 'pi pi-fw pi-calendar' },
    { label: 'Managers', route: { name: 'AdminManagers' }, icon: 'pi pi-fw pi-user-edit' },
    { label: 'Players', route: { name: 'AdminPlayers' }, icon: 'pi pi-fw pi-users' }
];
</script>

<template>
    <div class="full-page admin">
        <AppHeader />
        <div class="page-container custom-scrollbar">
            <div class="page-content">
                <!--                <AppTabMenu :items="items" />-->
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
    height: 100vh;
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
        //border-radius: 8px;
        //overflow: hidden;
        //box-shadow: 0px 10px 26px -10px rgba(100, 100, 100, 0.75);
        //-webkit-box-shadow: 0px 10px 26px -10px rgba(100, 100, 100, 0.75);
        //-moz-box-shadow: 0px 10px 26px -10px rgba(100, 100, 100, 0.75);
    }
}

.content {
    /*background: white;*/
    height: 100%;
    /* padding: 12px 26px;
    border-top: 1px solid lightgray;*/
}
</style>

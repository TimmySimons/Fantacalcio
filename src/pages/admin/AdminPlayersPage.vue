<script setup lang="ts">
import { ref } from 'vue';
import { FootballApi } from '../../supabase/football.api.ts';
import PlayersTable from '../../components/admin/PlayersTable.vue';

// const players = ref<any[] | null>(null);
//
// FootballApi.getPlayers().then((t) => {
//     players.value = t;
// });
</script>

<template>
    <!--    <PlayersTable v-if="players" :items="players" />-->

    <div class="wrapper">
        <div class="title">Players</div>
        <div class="wrapper inner">
            <PlayersTable v-if="true" />
            <div v-else>
                <i class="pi pi-spin pi-spinner" style="font-size: 12px"></i> Loading...
            </div>
        </div>
    </div>
</template>

<style scoped>
.wrapper {
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;

    &.inner {
        background: white;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #dee2e6;
    }
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import type { AppUserContract } from '../../model/app-user.contract.ts';
import { useAdminStore } from '../../stores/admin.store.ts';
import { storeToRefs } from 'pinia';
import ManagerDialog from './dialogs/ManagerDialog.vue';

const adminStore = useAdminStore();
const { managers } = storeToRefs(adminStore);

adminStore.getManagers();

const showDialog = ref(false);

const selectedManager = ref<AppUserContract | undefined>(undefined);

const onClickManager = (manager: AppUserContract) => {
    selectedManager.value = manager;
    showDialog.value = true;
};
</script>

<template>
    <ManagerDialog v-if="selectedManager" v-model="showDialog" :manager="selectedManager" />

    <div class="wrapper">
        <div class="title">Managers</div>
        <div class="wrapper inner">
            <div v-if="managers" class="players">
                <Card
                    class="card player flex"
                    v-for="manager in managers"
                    :key="manager.id"
                    @click="onClickManager(manager)"
                >
                    <template #content>
                        <div class="card-content">
                            <div>
                                <div class="team">{{ manager.team_name }}</div>
                                <div class="user">{{ manager.name }}</div>
                            </div>
                            <div class="count" :class="{ error: manager.playerCount !== 20 }">
                                {{ manager.playerCount }}
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
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

    .players {
        height: 100%;
        display: flex;
        flex-direction: column;
        min-height: 0;
        gap: 8px;
        overflow-y: auto;

        .player {
            background: #ffffff;
            font-size: 0.8em;

            .card-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }

            .team {
                font-weight: bold;
            }

            .user {
                color: #555555;
            }

            .count {
                font-size: 1.2em;
                height: 20px;
                width: 20px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                border: 1px solid #dee2e6;
                padding: 16px;
                border-color: #21ae21;
                color: #199519;

                &.error {
                    border-color: #ff7c4d;
                    color: orangered;
                }
            }
        }
    }
}
</style>

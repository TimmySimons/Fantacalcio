<script setup lang="ts">
import { useAdminStore } from '../../stores/admin.store.ts';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import { SorareApi } from '../../sorare/sorare.api.ts';
import { FootballApi } from '../../supabase/football.api.ts';
import GameweekPlayerCard from '../../components/admin/gameweeks/GameweekPlayerCard.vue';
import { useRoute } from 'vue-router';
import { Badge, useToast } from 'primevue';
import { PlayerPosition } from '../../model/player.contract.ts';

const route = useRoute();
const gameweekId = computed<string>(() => route.params.id as string);

const adminStore = useAdminStore();
const { gameweek, gameweekTeams } = storeToRefs(adminStore);
const toast = useToast();

const isLoading = ref(true);

adminStore.getGameweek(gameweekId.value).then(async () => {
    await adminStore.getGameweekTeams(gameweekId.value);

    if (gameweek.value && new Date(gameweek.value.start_date) < new Date()) {
        try {
            console.log('Auto-assigning teams...');
            await adminStore.getGameweeks();
            const result = await adminStore.autoAssignPreviousTeams();
            if (result.assigned > 0) {
                await adminStore.getGameweekTeams(gameweekId.value);
                toast.add({
                    severity: 'info',
                    summary: 'Teams Auto-Assigned',
                    detail: `Assigned ${result.assigned} team(s) from previous gameweek${
                        result.failed > 0 ? `, ${result.failed} failed` : ''
                    }.`,
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Auto-assign error:', error);
        }
    }

    isLoading.value = false;
});

const gameweekEnded = computed(() => {
    return (gameweek.value && new Date(gameweek.value.end_date) < new Date()) ?? false;
});

const gameweekStarted = computed(() => {
    return (gameweek.value && new Date(gameweek.value.start_date) < new Date()) ?? false;
});

const allGameweekPlayers = computed(() => gameweekTeams.value?.flatMap((p) => p.players) ?? []);

function chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

const sorareLoading = ref(false);
const getGameweekScores = async () => {
    if (gameweek.value && gameweek.value.sorare_slug) {
        sorareLoading.value = true;
        try {
            const updates: { id: number; score: number }[] = [];

            const promises = Object.values(PlayerPosition).flatMap((position) => {
                const players = allGameweekPlayers.value.filter(
                    (player) => player.player.position === position
                );

                const slugs = players.map((p) => p.player.sorare_slug);
                const chunks = chunkArray(slugs, 15);

                return chunks.map((group) =>
                    SorareApi.getPlayersGameweekScores(gameweek.value!.sorare_slug, group, position)
                );
            });

            const results = await Promise.all(promises);
            const allSorareScoresData = results.flat();

            console.log('test', allSorareScoresData);

            allSorareScoresData.forEach((playerData) => {
                const teamPlayers = allGameweekPlayers.value.filter(
                    (p) => p.player.sorare_slug === playerData.slug
                );

                console.log('teamPlayers', teamPlayers);

                if (teamPlayers.length > 0 && playerData?.anyGameStats.length > 0) {
                    teamPlayers.forEach((teamPlayer) => {
                        updates.push({
                            id: teamPlayer.teamPlayerId,
                            score: playerData.anyGameStats[0].playerGameScore.score
                        });
                    });
                }
            });

            console.log('updates', updates);

            FootballApi.updateGameweekPlayerScores(updates).then(async () => {
                await adminStore.updateGameweekScoredDate(gameweek.value!.id);
                await adminStore.getGameweekTeams(gameweek.value!.id);
                await adminStore.getGameweek(gameweekId.value, true);

                sorareLoading.value = false;

                toast.add({
                    severity: 'success',
                    summary: 'Scores Updated',
                    detail: 'Scores have been updated for all players.',
                    life: 3000
                });
            });
        } catch (e: any) {
            console.error(e);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: e.message,
                life: 3000
            });
            sorareLoading.value = false;
        }
    }
};

const publishScores = () => {
    if (gameweek.value) {
        try {
            adminStore.updateGameweekScorePublishedDate(gameweek.value.id).then(() => {
                adminStore.getGameweek(gameweekId.value, true);

                toast.add({
                    severity: 'success',
                    summary: 'Scores Published',
                    detail: 'Scores are now visible to everyone.',
                    life: 3000
                });
            });
        } catch (e: any) {
            console.error(e);
            toast.add({
                severity: 'error',
                summary: 'Error',
                detail: e.message,
                life: 3000
            });
        }
    }
};

const onScored = () => {
    adminStore.getGameweekTeams(gameweekId.value);
};
</script>

<template>
    <div class="flex-col">
        <div class="title flex items-center">
            <div class="flex items-center">
                <RouterLink :to="{ name: 'AdminGameweeks' }" class="link">
                    <i class="pi pi-arrow-circle-left" style="font-size: 1rem"></i>
                </RouterLink>
                Gameweek {{ gameweek?.week }}
            </div>
        </div>

        <template v-if="!isLoading">
            <template v-if="gameweek">
                <Badge v-if="!gameweekEnded" class="info" severity="danger">
                    Gameweek ends:
                    {{ dayjs(gameweek.end_date).format('DD MMM YYYY HH:mm') }}
                </Badge>
                <div class="actions flex" v-if="gameweekStarted">
                    <div class="">
                        <Button
                            label="Get Scores"
                            @click="getGameweekScores"
                            class="new-btn"
                            :disabled="sorareLoading || allGameweekPlayers.length === 0"
                            :loading="sorareLoading"
                        />
                        <div class="date">
                            Last fetched:
                            {{
                                gameweek?.scores_fetched_date
                                    ? dayjs(gameweek?.scores_fetched_date).format('DD MMM HH:mm')
                                    : '-'
                            }}
                        </div>
                    </div>
                    <div class="">
                        <Button
                            label="Publish Scores"
                            @click="publishScores"
                            class="new-btn"
                            :disabled="
                                !gameweek?.scores_fetched_date || !!gameweek?.scores_published_date
                            "
                        />
                        <div class="date">
                            Published on:
                            {{
                                gameweek?.scores_published_date
                                    ? dayjs(gameweek?.scores_published_date).format('DD MMM HH:mm')
                                    : '-'
                            }}
                        </div>
                    </div>
                </div>
            </template>

            <div class="flex-col players" v-if="gameweekTeams">
                <div
                    v-for="gwTeam in gameweekTeams.sort((a, b) =>
                        a.team.name.localeCompare(b.team.name)
                    )"
                    :key="gwTeam.team.name"
                    class="team"
                >
                    <div class="team-name">{{ gwTeam.team.name }}</div>
                    <GameweekPlayerCard
                        v-for="player in [...gwTeam.players].sort((a, b) =>
                            (a.player.last_name ?? a.player.first_name).localeCompare(
                                b.player.last_name ?? b.player.first_name
                            )
                        )"
                        :key="player.player.id"
                        :player="player.player"
                        :team-player-id="player.teamPlayerId"
                        :score="player.score"
                        @scored="onScored"
                    />
                    <div class="none" v-if="gwTeam.players.length === 0">No players</div>
                </div>
            </div>
        </template>

        <div class="loading" v-if="isLoading">
            <i class="pi pi-spin pi-spinner" style="font-size: 24px"></i>
        </div>
    </div>
</template>

<style scoped>
.title {
    justify-content: space-between;
}

.team {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .team-name {
        font-weight: bold;
        font-size: 0.8em;
        position: sticky;
        top: 0;
        padding: 12px 0 8px 0;
        background: whitesmoke;
    }
}

.players {
    gap: 8px;
    overflow-y: auto;
}

.actions {
    gap: 8px;
    padding-bottom: 16px;
    border-bottom: 1px solid #dee2e6;

    > * {
        flex: 1;
        width: 100%;

        button {
            width: 100%;
        }
    }

    .date {
        font-size: 0.7em;
        margin-top: 4px;
        color: #666666;
    }
}

.none {
    font-size: 0.9em;
    color: #666666;
}

.pi {
    color: #333333;
    margin-right: 0.5rem;
}

.info {
    margin-bottom: 12px;
}
</style>

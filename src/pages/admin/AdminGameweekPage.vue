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

adminStore.getGameweek(gameweekId.value).then(() => adminStore.getGameweekTeams(gameweekId.value));

const gameweekEnded = computed(() => {
    return (gameweek.value && new Date(gameweek.value.end_date) < new Date()) ?? false;
});

const allGameweekPlayers = computed(() => gameweekTeams.value?.flatMap((p) => p.players) ?? []);

const sorareLoading = ref(false);
const getGameweekScores = async () => {
    if (gameweek.value && gameweek.value.sorare_slug) {
        sorareLoading.value = true;
        try {
            const updates: { id: number; score: number }[] = [];

            const promises = Object.values(PlayerPosition).map((position) =>
                SorareApi.getPlayersGameweekScores(
                    gameweek.value!.sorare_slug,
                    allGameweekPlayers.value
                        .filter((player) => player.player.position === position)
                        .map((player) => `${player.player.sorare_slug}`) ?? [],
                    position
                )
            );

            const results = await Promise.all(promises);
            const allSorareScoresData = results.flat();

            allSorareScoresData.forEach((playerData) => {
                const teamPlayers = allGameweekPlayers.value.filter(
                    (p) => p.player.sorare_slug === playerData.slug && p.score === null
                );

                if (teamPlayers.length > 0 && playerData?.anyGameStats.length > 0) {
                    teamPlayers.forEach((teamPlayer) => {
                        updates.push({
                            id: teamPlayer.teamPlayerId,
                            score: playerData.anyGameStats[0].playerGameScore.score
                        });
                    });
                }
            });

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

        <template v-if="gameweek">
            <div class="actions flex" v-if="gameweekEnded">
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
            <Badge v-else class="info">
                Gameweek ends:
                {{ dayjs(gameweek.end_date).format('DD MMM YYYY HH:mm') }}
            </Badge>
        </template>

        <div class="flex-col players">
            <div v-for="gwTeam in gameweekTeams" :key="gwTeam.team.name" class="team">
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
        margin-top: 16px;
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
</style>

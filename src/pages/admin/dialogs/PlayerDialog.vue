<script setup lang="ts">
import { ref, watch } from 'vue';
import type { PlayerContract } from '../../../model/player.contract.ts';
import PlayerIcon from '../../../assets/icons/soccer-player.svg';
import PlayerInfoLine from '../../../components/admin/players/PlayerInfoLine.vue';
import { Util } from '../../../util.ts';
import dayjs from 'dayjs';
import { SorareApi } from '../../../sorare/sorare.api.ts';
import { useFootballScoreStore } from '../../../stores/football-scores.store.ts';
import AverageScore from '../../../components/admin/players/AverageScore.vue';

const props = defineProps<{
    player: PlayerContract | undefined;
    editable: boolean;
    isLoadingSorare?: boolean;
}>();

const emit = defineEmits<{
    (e: 'save', sorareSlug: string): void;
    (e: 'scores-fetched'): void;
}>();

const showDialog = defineModel<boolean>({ required: false, default: false });

const sorareSlug = ref<string | undefined>();

const footballScoreStore = useFootballScoreStore();

watch(
    () => props.player?.sorare_slug,
    async (slug) => {
        sorareSlug.value = slug;

        if (slug && props.player && !props.player.PlayerSorareAverages) {
            await SorareApi.getPlayersScores([slug]).then((scores) => {
                // TODO: update averages

                const playerScores = scores[0];
                if (playerScores) {
                    console.log('create', props.player);
                    console.log('createScores', playerScores);

                    footballScoreStore
                        .createPlayerAverageScores(props.player!.id, playerScores)
                        .then(() => {
                            emit('scores-fetched');
                        });
                }
            });
        } else {
            console.log('SKIP create scores');
        }
    },
    { immediate: true }
);

const onSave = () => {
    if (sorareSlug.value && !props.isLoadingSorare) {
        emit('save', sorareSlug.value);
    }
};
</script>

<template>
    <Dialog
        v-model:visible="showDialog"
        modal
        :header="`${player?.first_name} ${player?.last_name}`"
        :style="{ width: '96%', height: '100%' }"
        class="player-dialog"
    >
        <div class="dialog-content">
            <div class="img-container">
                <div class="dotted-bg"></div>
                <img v-if="player?.picture_url" :src="player.picture_url" class="player-img" />
                <component v-else :is="PlayerIcon" class="svg player" />
            </div>

            <div class="info items-center">
                <div class="name">{{ player?.first_name ?? '—' }} {{ player?.last_name }}</div>
                <div class="position">{{ player?.position ?? '—' }}</div>

                <div class="flex-col">
                    <div class="meta">
                        <div>
                            <span>Age</span
                            ><span>{{ Util.getAge(player?.birth_date) ?? '—' }}</span>
                        </div>
                        <div>
                            <span>Height</span
                            ><span>{{ player?.height ? `${player.height} cm` : '—' }}</span>
                        </div>
                        <div>
                            <span>Weight</span
                            ><span>{{ player?.weight ? `${player.weight} kg` : '—' }}</span>
                        </div>
                    </div>

                    <div class="flex tiles">
                        <PlayerInfoLine
                            :value="player?.club_name_short"
                            :bg-url="player?.club_picture_url"
                            :plain="true"
                        />
                        <PlayerInfoLine
                            :value="player?.country"
                            :bg-url="player?.country_flag_picture_url"
                            :plain="true"
                        />
                    </div>

                    <div class="flex scores">
                        <AverageScore
                            :gw-count="5"
                            :average="player?.PlayerSorareAverages?.average_last_five"
                            :average-decisive="
                                player?.PlayerSorareAverages?.average_last_five_decisive
                            "
                            :average-all-round="
                                player?.PlayerSorareAverages?.average_last_five_all_round
                            "
                            :appearances="player?.PlayerSorareAverages?.last_five_appearances"
                        />
                        <AverageScore
                            :gw-count="15"
                            :average="player?.PlayerSorareAverages?.average_last_fifteen"
                            :average-decisive="
                                player?.PlayerSorareAverages?.average_last_fifteen_decisive
                            "
                            :average-all-round="
                                player?.PlayerSorareAverages?.average_last_fifteen_all_round
                            "
                            :appearances="player?.PlayerSorareAverages?.last_fifteen_appearances"
                        />
                        <AverageScore
                            :gw-count="40"
                            :average="player?.PlayerSorareAverages?.average_forty"
                            :average-decisive="player?.PlayerSorareAverages?.average_forty_decisive"
                            :average-all-round="
                                player?.PlayerSorareAverages?.average_forty_all_round
                            "
                            :appearances="player?.PlayerSorareAverages?.last_forty_appearances"
                        />
                    </div>

                    <div v-if="editable">
                        <div class="sorare">
                            <div class="flex gap-8 items-center">
                                <label for="sorare" class="font-semibold w-24">Sorare ID</label>
                                <InputText
                                    id="sorare"
                                    class="flex-auto"
                                    autocomplete="off"
                                    v-model="sorareSlug"
                                    :disabled="!!player?.sorare_last_updated"
                                />
                            </div>
                            <div class="sync" v-if="player?.sorare_slug">
                                Last sync:
                                <span v-if="player?.sorare_last_updated">{{
                                    dayjs(player.sorare_last_updated).format('DD MMM YYYY')
                                }}</span>
                                <span v-else>Never</span>
                            </div>
                        </div>

                        <div
                            class="flex justify-end gap-8 buttons"
                            v-if="!player?.sorare_last_updated"
                        >
                            <Button type="button" label="Save" @click="onSave"></Button>
                        </div>
                    </div>
                    <div v-else></div>
                </div>
            </div>
        </div>
    </Dialog>
</template>

<style scoped>
.img-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: radial-gradient(#000000, #007fff52);
    padding-top: 50px;
    border-radius: 12px 12px 0 0;
    min-height: 140px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: -1;

    .dotted-bg {
        position: absolute;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        background-image: radial-gradient(#77b2ff 1px, transparent 1px);
        background-size: 12px 12px;
    }

    .player-img {
        height: 160px;
        width: 160px;
        position: relative;
        z-index: 2;
    }

    .svg.player {
        height: 160px;
        width: 160px;
        fill: #9fbbd2;
        margin-bottom: -7px;
        position: relative;
        z-index: 2;
    }
}

.dialog-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: inherit;
}

.info {
    padding-top: 150px;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;

    .name {
        font-size: 1.3em;
        font-weight: bold;
    }

    .position {
        margin-bottom: 16px;
        font-size: 0.8em;
        color: #4e4e4e;
        font-style: italic;
    }
}

.flex-col {
    display: flex;
    flex-direction: column;
    height: 100%;
    box-sizing: border-box;
    justify-content: space-between;
}

.sorare {
    border-top: 1px solid #dee2e6;
    padding-top: 20px;

    label {
        white-space: nowrap;
        font-size: 0.8em;
    }

    input {
        flex: 1;
    }
}

.meta {
    display: flex;
    justify-content: space-around;
    font-size: 0.7em;
    color: #4e4e4e;
    gap: 6px;

    > div {
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
        border: 1px solid #e9e9e9;
        border-radius: 2px;
        padding: 2px 0;

        span:last-child {
            font-weight: bold;
        }
    }
}

.scores {
    display: flex;
    justify-content: space-around;
}

.buttons {
    button {
        margin-top: 4px;
    }
}

.sync {
    font-size: 0.7em;
    color: #9a9a9a;
    margin-top: 8px;
    text-align: right;
}
</style>

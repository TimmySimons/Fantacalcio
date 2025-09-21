<script setup lang="ts">
import LaurelIcon from '../../assets/icons/laurel.svg';
import type { ManagerContract } from '../../model/manager.contract.ts';

defineProps<{
    topThree: (ManagerContract | undefined)[];
}>();
</script>

<template>
    <div class="stage">
        <div v-for="(top, idx) in topThree" :key="idx" class="spot" :class="`spot-${idx}`">
            <div class="visuals">
                <div class="entity">
                    <div class="rank">{{ idx === 0 ? 2 : idx === 1 ? 1 : 3 }}</div>
                    <component :is="LaurelIcon" class="svg" />
                </div>
                <div class="table"></div>
            </div>

            <div class="text">
                <div class="score">
                    {{ top?.totalScore }}
                </div>
                <div class="team">{{ top?.team_name }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.stage {
    display: flex;
    width: 100%;
    gap: 8px;
    padding: 24px 18px;
    position: sticky;
    top: 0;
    max-width: 600px;
    margin: 0 auto;

    .spot {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;

        .visuals {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 180px;
        }

        .entity {
            min-height: 80px;
            width: 80px;
            position: relative;

            .rank {
                position: absolute;
                left: 50%;
                bottom: 22px;
                transform: translate(-50%, 0);
                font-size: 1.5em;
                font-weight: bold;
            }

            .svg {
                height: 100%;
                width: 100%;
            }
        }

        .table {
            height: 60px;
            width: 100%;
            background: rgb(126 1 1);
            background: linear-gradient(0deg, rgb(71, 0, 0) 0%, rgb(145, 0, 0) 100%);
            border-radius: 12px 12px 0 0;
            box-shadow: 0px -14px 14px #3b0000;
        }

        &.spot-0 {
            .svg {
                fill: #959595;
                margin-top: 20px;
            }
            .rank {
                color: #959595;
            }
        }
        &.spot-1 {
            .table {
                height: 90px;
            }
            .svg {
                fill: goldenrod;
            }
            .rank {
                color: goldenrod;
                bottom: 32px;
            }
        }
        &.spot-2 {
            .table {
                height: 40px;
            }
            .svg {
                fill: #b16437;
                margin-top: 34px;
            }
            .rank {
                color: #b16437;
                bottom: 14px;
            }
        }
    }

    .text {
        color: white;
        text-align: center;
        font-size: 0.7em;
        margin-top: -16px;

        .team {
            opacity: 0.7;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 100px;
        }

        .score {
            font-size: 1.4em;
            font-weight: bold;
        }
    }
}
</style>

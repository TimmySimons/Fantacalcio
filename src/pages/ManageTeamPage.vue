<script setup lang="ts">
import { type PlayerContract, PlayerPosition } from '../model/player.contract.ts';
import PlayerRow from '../components/team/PlayerRow.vue';
import AppTabMenu from '../components/AppTabMenu.vue';

const players: PlayerContract[] = [
    {
        id: '001',
        firstName: 'Some Keeper',
        lastName: 'Sanchez',
        position: PlayerPosition.Goalkeeper,
        team: 'FC Barcelona'
    },
    {
        id: '002',
        firstName: 'Some Defender',
        lastName: 'Aina',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '003',
        firstName: 'Some Defender',
        lastName: 'Van de Ven',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '008',
        firstName: 'Some Defender',
        lastName: 'De Cuyper',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '009',
        firstName: 'Some Defender',
        lastName: 'Gvardiol',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '010',
        firstName: 'Some Defender',
        lastName: 'Vuskovic',
        position: PlayerPosition.Defender,
        team: 'FC Barcelona'
    },
    {
        id: '004',
        firstName: 'Some Midfielder',
        lastName: 'Reijnders',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '007',
        firstName: 'Some Midfielder',
        lastName: 'Sadiki',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '008',
        firstName: 'Some Midfielder',
        lastName: 'M. Salah',
        position: PlayerPosition.Midfielder,
        team: 'FC Barcelona'
    },
    {
        id: '005',
        firstName: 'Some Attacker',
        lastName: 'Bowen',
        position: PlayerPosition.Attacker,
        team: 'FC Barcelona'
    },
    {
        id: '012',
        firstName: 'Some Attacker',
        lastName: 'Watkins',
        position: PlayerPosition.Attacker,
        team: 'FC Barcelona'
    }
];

const tabItems = [
    { label: 'My Team', route: { name: 'ManageTeam' } },
    { label: 'Points', route: { name: 'ManageTeam' } }
];
</script>

<template>
    <div class="wrapper">
        <AppTabMenu :items="tabItems" :tab-style="true" />
        <div class="pad">
            <div class="pitch card">
                <div class="players-layer">
                    <PlayerRow
                        :players="players.filter((p) => p.position === PlayerPosition.Goalkeeper)"
                        group="keepers"
                    />
                    <PlayerRow
                        :players="players.filter((p) => p.position === PlayerPosition.Defender)"
                        group="keepers"
                    />
                    <PlayerRow
                        :players="players.filter((p) => p.position === PlayerPosition.Midfielder)"
                        group="keepers"
                    />
                    <PlayerRow
                        :players="players.filter((p) => p.position === PlayerPosition.Attacker)"
                        group="keepers"
                    />
                    <div class="position-group hidden">
                        <div class="player"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="substitutes">
            <div class="title">Substitutes</div>
            <PlayerRow
                :players="players.filter((p) => p.position === PlayerPosition.Defender)"
                group="keepers"
            />
        </div>
    </div>
</template>

<style scoped>
.wrapper {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .pad {
        height: 100%;
        width: 100%;
        padding: 0 18px 18px;
    }

    .card {
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        position: relative;
    }

    .players-layer {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        padding: 18px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        gap: 12px;
        justify-content: space-between;
    }

    .player {
        height: 46px;
        width: 46px;
    }
}
.pitch {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-image: url('../assets/football-pitch-green.png');
    background-size: 100% 100%;
}

.substitutes {
    width: 100%;
    height: 140px;
    background: #bfbfbf;
    border-radius: 12px 12px 0 0;
    padding: 8px 0 12px 0;

    .title {
        font-size: 0.8em;
        margin: 0px 0 12px 0;
        color: white;
    }

    :deep(.svg) {
        opacity: 0.8;
    }
}
</style>

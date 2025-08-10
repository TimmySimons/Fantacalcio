<script setup lang="ts">
import { useAuth } from '../supabase/useAuth.ts';
import { useRouter } from 'vue-router';
import LeaderBoard from '../components/LeaderBoard.vue';

const { user, signOut } = useAuth();

const router = useRouter();
const signOutHandler = async () => {
    signOut().then(() => {
        if (!user.value) {
            router.push({ name: 'Login' });
        }
    });
};
</script>

<template>
    <div class="container">
        <LeaderBoard />
        <!--        <div>Hi, welcome home!</div>-->
        <!--        <button @click="signOutHandler">Sign Out</button>-->

        <!--        <Button label="Verify" />-->
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
}
</style>

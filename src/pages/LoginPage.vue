<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from './../supabase/useAuth.ts';
import { useRouter } from 'vue-router';

const { user, signUp, signIn, signOut, error: authError, loading } = useAuth();
const router = useRouter();

const email = ref('');
const password = ref('');

async function signUpHandler() {
    await signUp(email.value, password.value);
}

async function signInHandler() {
    signIn(email.value, password.value).then(() => {
        if (user.value) {
            router.push({ name: 'Home' });
        }
    });
}

function signOutHandler() {
    signOut();
}
</script>

<template>
    <div class="wrapper">
        <div class>
            <img alt="logo" src="/pwa-192x192.png" height="140" class="mr-2" />
        </div>

        <div v-if="!user" class="login-form">
            <InputText v-model="email" placeholder="Email" />
            <InputText type="password" v-model="password" placeholder="Password" />
            <Button @click="signInHandler" severity="danger">Sign In</Button>
            <Button @click="signUpHandler" severity="contrast">Sign Up</Button>
            <p v-if="authError" class="info error">{{ authError.message }}</p>
            <p v-else-if="loading" class="info">Loading...</p>
            <p v-else class="info"></p>
        </div>

        <div v-else>
            <h2>Already logged in, {{ user.email }}</h2>
            <button @click="signOutHandler">Sign Out</button>
        </div>
    </div>
</template>

<style scoped>
.wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    height: 100dvh;
    gap: 20px;

    .login-form {
        display: flex;
        flex-direction: column;
        gap: 12px;
        width: 300px;
    }

    .info {
        text-align: center;
        height: 30px;
    }
}
</style>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import DefaultLayout from './layouts/DefaultLayout.vue';

function setViewportHeight() {
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

setViewportHeight();
</script>

<template>
    <component
        :is="useRoute().meta.layout ?? DefaultLayout"
        v-bind="useRoute().meta.layoutProps ?? {}"
    />
</template>

<style scoped></style>

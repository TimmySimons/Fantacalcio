import { createApp } from 'vue';
import './style.css';
import 'primeicons/primeicons.css';
import App from './App.vue';
import router from './router/route.ts';
import { ScreenSizeUtil } from './size.ts';
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth.store.ts';
import { primevuePlugin } from './primevue/primevue.ts';

(async () => {
    const app = createApp(App);

    app.use(router);

    const pinia = createPinia();
    app.use(pinia);

    app.use(primevuePlugin);

    const authStore = useAuthStore();
    await useAuthStore()
        .getAuthUser()
        .then(async () => {
            await authStore.getAppUser();
        });

    app.mount('#app');

    ScreenSizeUtil.setViewportHeight();
    ScreenSizeUtil.watchViewPortChange();
})();

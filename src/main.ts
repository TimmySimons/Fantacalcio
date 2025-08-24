import { createApp } from 'vue';
import './style.css';
import 'primeicons/primeicons.css';
import App from './App.vue';
import router from './router/route.ts';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Button from 'primevue/button';
import TabMenu from 'primevue/tabmenu';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import Toolbar from 'primevue/toolbar';
import Dialog from 'primevue/dialog';
import Toast from 'primevue/toast';
import { Card, DatePicker, Drawer, ToastService, ToggleSwitch, Checkbox } from 'primevue';
import { ScreenSizeUtil } from './size.ts';
import { createPinia } from 'pinia';
import { useAuthStore } from './stores/auth.store.ts';

(async () => {
    const app = createApp(App);

    app.use(router);

    const pinia = createPinia();
    app.use(pinia);

    app.use(PrimeVue, {
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: '.my-app-dark'
            }
        }
    });
    app.use(ToastService);
    app.component('Button', Button);
    app.component('TabMenu', TabMenu);
    app.component('InputText', InputText);
    app.component('Select', Select);
    app.component('Tag', Tag);
    app.component('Toolbar', Toolbar);
    app.component('Dialog', Dialog);
    app.component('Toast', Toast);
    app.component('Card', Card);
    app.component('Drawer', Drawer);
    app.component('DatePicker', DatePicker);
    app.component('ToggleSwitch', ToggleSwitch);
    app.component('Checkbox', Checkbox);

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

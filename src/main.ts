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
import { ToastService } from 'primevue';
import { ScreenSizeUtil } from './size.ts';

// test comment
const app = createApp(App);

app.use(router);

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

app.mount('#app');

ScreenSizeUtil.setViewportHeight();
ScreenSizeUtil.watchViewPortChange();

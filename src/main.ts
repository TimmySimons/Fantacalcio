import { createApp } from 'vue';
import './style.css';
import 'primeicons/primeicons.css';
import App from './App.vue';
import router from './router/route.ts';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import Nora from '@primeuix/themes/nora';
import Lara from '@primeuix/themes/lara';
import Button from 'primevue/button';
import TabMenu from 'primevue/tabmenu';
import InputText from 'primevue/InputText';
import Select from 'primevue/Select';
import Tag from 'primevue/Tag';
import Toolbar from 'primevue/Toolbar';
import Dialog from 'primevue/Dialog';
import Toast from 'primevue/Toast';
import { ToastService } from 'primevue';

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

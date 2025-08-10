import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router/route.ts';


// test comment
const app = createApp(App);

app.use(router);

app.mount('#app');

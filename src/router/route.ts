import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import LoginPage from '../pages/LoginPage.vue';
import { supabase } from '../supabase/supabase.ts';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginPage
    },
    {
        path: '/',
        name: 'Home',
        component: HomePage,
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory('/Fantacalcio/'),
    routes
});

router.beforeEach(async (to, _from, next) => {
    let user = null;
    await supabase.auth.getSession().then(({ data }) => {
        user = data.session?.user || null;
    });

    if (to.meta.requiresAuth && !user) {
        next({ name: 'Login' });
    } else if (to.name === 'Login' && user) {
        next({ name: 'Home' });
    } else {
        next();
    }
});

export default router;

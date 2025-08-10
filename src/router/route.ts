import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import LoginPage from '../pages/LoginPage.vue';
import { supabase } from '../supabase/supabase.ts';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import AdminHomePage from '../pages/admin/AdminHomePage.vue';
import ManageTeamsPage from '../pages/ManageTeamsPage.vue';
import AdminPlayersPage from '../pages/admin/AdminPlayersPage.vue';
import AdminGameweeksPage from '../pages/admin/AdminGameweeksPage.vue';
import AdminManagersPage from '../pages/admin/AdminManagersPage.vue';
import EmptyLayout from '../layouts/EmptyLayout.vue';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: { layout: EmptyLayout }
    },
    {
        path: '/',
        meta: { requiresAuth: true, layout: DefaultLayout },
        redirect: { name: 'Home' },
        children: [
            {
                path: '',
                name: 'Home',
                component: HomePage
            },
            {
                path: 'my-team',
                name: 'ManageTeam',
                component: ManageTeamsPage
            }
        ]
    },
    {
        path: '/admin',
        meta: { requiresAuth: true, layout: AdminLayout },
        children: [
            {
                path: '',
                name: 'Admin',
                //component: AdminHomePage
                redirect: { name: 'AdminGameweeks' }
            },
            {
                path: 'players',
                name: 'AdminPlayers',
                component: AdminPlayersPage
            },
            {
                path: 'gameweeks',
                name: 'AdminGameweeks',
                component: AdminGameweeksPage
            },
            {
                path: 'managers',
                name: 'AdminManagers',
                component: AdminManagersPage
            }
        ]
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

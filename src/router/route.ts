import { createRouter, createWebHistory } from 'vue-router';
import LeaderboardPage from '../pages/LeaderboardPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';
import AdminLayout from '../layouts/AdminLayout.vue';
import ManageTeamPage from '../pages/ManageTeamPage.vue';
import AdminPlayersPage from '../pages/admin/AdminPlayersPage.vue';
import AdminGameweeksPage from '../pages/admin/AdminGameweeksPage.vue';
import AdminGameweekPage from '../pages/admin/AdminGameweekPage.vue';
import AdminManagersPage from '../pages/admin/AdminManagersPage.vue';
import ManagerProfilePage from '../pages/ManagerProfilePage.vue';
import EmptyLayout from '../layouts/EmptyLayout.vue';
import { useAuthStore } from '../stores/auth.store.ts';

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
        redirect: { name: 'Leaderboard' },
        children: [
            {
                path: '',
                name: 'Leaderboard',
                component: LeaderboardPage
            },
            {
                path: 'my-team',
                name: 'ManageTeam',
                component: ManageTeamPage
            },
            {
                path: '/managers/:id',
                name: 'ManagerProfile',
                component: ManagerProfilePage
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
                redirect: { name: 'AdminGameweeks' }
            },
            {
                path: 'players',
                name: 'AdminPlayers',
                component: AdminPlayersPage
            },
            {
                path: 'gameweeks',
                children: [
                    {
                        path: '',
                        name: 'AdminGameweeks',
                        component: AdminGameweeksPage
                    },
                    {
                        path: ':id',
                        name: 'AdminGameweek',
                        component: AdminGameweekPage
                    }
                ]
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
    await useAuthStore().getAuthUser();
    let user = useAuthStore().authUser;

    if (to.meta.requiresAuth && !user) {
        next({ name: 'Login' });
    } else if (to.name === 'Login' && user) {
        next({ name: 'Leaderboard' });
    } else {
        next();
    }
});

export default router;

import { defineStore } from 'pinia';
import type { AppUserContract } from '../model/app-user.contract.ts';
import type { User } from '@supabase/supabase-js';
import { AuthApi } from '../supabase/auth.api.ts';

export const useAuthStore = defineStore('auth-store', {
    state: (): {
        authUser: User | null;
        appUser: AppUserContract | undefined;
    } => ({ authUser: null, appUser: undefined }),
    getters: {
        hasSuperPowers: (state) => state.appUser?.roles.includes('SUPER_ADMIN') ?? false
    },
    actions: {
        async getAuthUser() {
            this.authUser = await AuthApi.getAuthUser();
        },
        async getAppUser() {
            if (!this.authUser) return;
            this.appUser = await AuthApi.getAppUser(this.authUser.id);
        },
        async getAuthUserAndAppUser() {
            await this.getAuthUser();
            await this.getAppUser();
        },
        async clearUsers() {
            this.authUser = null;
            this.appUser = undefined;
        }
    }
});

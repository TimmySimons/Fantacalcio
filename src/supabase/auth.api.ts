import { supabase } from './supabase.ts';
import type { AppUserContract } from '../model/app-user.contract.ts';
import type { User } from '@supabase/supabase-js';

export class AuthApi {
    public static async getAuthUser(): Promise<User | null> {
        const { data } = await supabase.auth.getSession();
        return data.session?.user || null;
    }

    public static async getAppUser(authUserId: string): Promise<AppUserContract | undefined> {
        const { data, error } = await supabase
            .from('Users')
            .select('*')
            .eq('auth_user_id', authUserId)
            .single();

        if (error) throw error;
        if (!data) return;

        return data;
    }
}

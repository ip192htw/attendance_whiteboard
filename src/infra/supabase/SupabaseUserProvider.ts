import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { UserProvider } from "../../domain/auth/provider";


export class SupabaseUserProvider implements UserProvider {

    constructor(
        private readonly client: SupabaseClient,
    ) {
        if (!client) {
            throw new Error('SupabaseUserProvider initialized without SupabaseClient!');
        }
    }


    async get(): Promise<User | null> {

        const { data, error } = await this.client.auth.getUser();

        if (error) {
            
            if (error.message === "Auth session missing!") {
                return null; // 未登入是正常的，優雅地回傳 null
            }

            throw new Error(`Error fetching user: ${error.message}`);
        }
        
        if (!data) {
            return null;
        }

        return data.user;
    }
}
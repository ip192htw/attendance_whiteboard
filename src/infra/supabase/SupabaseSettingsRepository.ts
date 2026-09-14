import { SupabaseClient } from "@supabase/supabase-js";

import { SettingsRepository, Setting } from "@/src/domain/system";


export class SupabaseSettingsRepository 
    implements SettingsRepository {

    constructor(
        private readonly client: SupabaseClient,
    ) {
        if (!client) {
            throw new Error('SupabaseUserProvider initialized without SupabaseClient!');
        }
    }


    private from() {
        return this.client
            .schema("system")
            .from("settings");
    }

    async get(key: string): Promise<Setting | null> {
        const { data, error } = await this.from()
            .select("*")
            .eq("key", key)
            .maybeSingle();
        if (error) {
            throw error;
        }

        if (!data) {
            return null;
        }

        return data;
    }

    async getMany(keys: string[]): Promise<Setting[]> {
        const { data, error } = await this.from()
            .select("*")
            .in("key", keys);

        if (error) {
            throw error;
        }

        return data;
    }


    async getAll(): Promise<Setting[]> {
        const { data, error } = await this.from()
            .select("*");

        if (error) {
            throw error;
        }

        return data;
    }

    async set(setting: Setting): Promise<void> {
        const { error } = await this.from()
            .upsert(setting, { onConflict: "key" });

        if (error) {
            throw error;
        }

    }

    async setMany(settings: Setting[]): Promise<void> {
        const { error } = await this.from()
            .upsert(settings, { onConflict: "key" });

        if (error) {
            throw error;
        }


    }

    
}
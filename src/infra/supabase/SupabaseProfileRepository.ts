import type { SupabaseClient } from "@supabase/supabase-js";

import {
    Profile,
    ProfileQuery,
    ProfileList,
    ProfileRepository,
    Role
} from "../../domain/identity"


export class SupabaseProfileRepository
    implements ProfileRepository {

    constructor(
        protected readonly client: SupabaseClient,
    ) {}

    private from() {
        return this.client
            .schema("identity")
            .from("users");
    }

    private buildQuery(query: ProfileQuery) {
        let q = this.from()
            .select("*", { count: "exact" });

        if (query.email?.length) {
            q = q.in("email", query.email);
        }

        if (query.role?.length) {
            q = q.in("role", query.role);
        }

        if (query.class?.length) {
            q = q.in("class", query.class);
        }

        switch (query.sort) {
            case "class-asc":
                q = q.order("class", { ascending: true });
                break;
            case "class-desc":
                q = q.order("class", { ascending: false });
                break;
            case "email-asc":
                q = q.order("email", { ascending: true });
                break;
            case "email-desc":
                q = q.order("email", { ascending: false });
                break;
            case "newest":
                q = q.order("created_at", { ascending: false });
                break;
            case "oldest":
                q = q.order("created_at", { ascending: true });
                break;
        }

        return q;
    }

    async getUserByEmail(
        email: string
    ): Promise<Profile | null> {
        const { data, error } = await this.from()
            .select("*")
            .eq("email", email)
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return null;
        }

        return data;
    }

    async getUserByUid(
        uid: string
    ): Promise<Profile | null> {
        const { data, error } = await this.from()
            .select("*")
            .eq("auth_user_id", uid)
            .maybeSingle();

        if (error) {
            throw error;
        }

        if (!data) {
            return null;
        }

        return data;
    }

    async getUsersByRole(
        role: Role
    ): Promise<Profile[]> {
        const { data, error } = await this.from()
            .select("*")
            .eq("role", role);

        if (error) {
            throw error;
        }

        return data;
    }

    async getUsers(): Promise<Profile[]> {
        const { data, error } = await this.from()
            .select("*");

        if (error) {
            throw error;
        }

        return data;
    }

    async find(query: ProfileQuery): Promise<ProfileList> {
        const q = this.buildQuery(query)
            .range(
                (query.page - 1) * query.pageSize,
                query.page * query.pageSize - 1
            );
            
        const { data, count, error } = await q;
        if (error) {
            throw error;
        }

        return {
            items: data ?? [],
            total: count ?? 0,
            page: query.page,
            pageSize: query.pageSize,
        };
    }

    async create(profile: Profile): Promise<void> {
        const { error } = await this.from()
            .insert(profile);

        if (error) {
            throw error;
        }

    }

    async createMany(profiles: Profile[]): Promise<void> {
        const { error } = await this.from()
            .insert(profiles);

        if (error) {
            throw error;
        }
    }

    async update(profile: Profile): Promise<void> {
        const { error } = await this.from()
            .update(profile)
            .eq("email", profile.email);

        if (error) {
            throw error;
        }
    }
    async delete(email: string): Promise<void> {
        const { error } = await this.from()
            .delete()
            .eq("email", email);

        if (error) {
            throw error;
        }
    }

    async deleteMany(emails: string[]): Promise<void> {
        const { error } = await this.from()
            .delete()
            .in("email", emails);

        if (error) {
            throw error;
        }

    }

    async deleteByRole(role: Role): Promise<void> {
        const { error } = await this.from()
            .delete()
            .eq("role", role);
            
        if (error) {
            throw error;
        }
    }
    
}
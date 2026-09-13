import type { SupabaseClient } from "@supabase/supabase-js";

import { SessionProvider } from "../../domain/auth/provider";

export class SupabaseSessionProvider
    implements SessionProvider {

    constructor(
        private readonly client: SupabaseClient,
    ) {}

    async exchangeCodeForSession(code: string): Promise<void> {

        const { error } =
            await this.client.auth.exchangeCodeForSession(code);

        if (error) {

            throw error;

        }

    }


}
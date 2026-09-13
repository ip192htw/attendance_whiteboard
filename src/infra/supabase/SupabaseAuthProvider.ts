

import { createClient } from "@/utils/supabase/client";

import type { AuthenticationProvider } from "../../domain/auth/provider";



export class SupabaseAuthenticationProvider
    implements AuthenticationProvider {

    private readonly supabase = createClient();


    async signInWithGoogle(): Promise<void> {

        const origin = typeof window !== 'undefined' ? window.location.origin : ''


        const { error } =
            await this.supabase.auth.signInWithOAuth({

                provider: "google",

                options: {

                    redirectTo:
                        `${origin}/auth/callback`,

                },

            });


        if (error) {

            throw error;

        }

    }

    async signInWithGoogleIdToken(
        provider: string,
        token: string,
    ): Promise<void> {

        
        const { error } =
            await this.supabase.auth.signInWithIdToken({
                provider: provider,

                token
            });

        if (error) {

            throw error;

        }

    }

    async signOut(): Promise<void> {


        const { error } =
            await this.supabase.auth.signOut();

        if (error) {

            throw error;

        }

    }

    async refreshSession(): Promise<void> {

        const { error } =
            await this.supabase.auth.refreshSession();

        if (error) {

            throw error;

        }

    }

}
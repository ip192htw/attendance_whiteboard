import { SupabaseAuthenticationProvider } from "@/src/infra/supabase/SupabaseAuthProvider";



export async function signInWithGoogle(redirectUrl: string) {
    const authProvider = new SupabaseAuthenticationProvider();
    await authProvider.signInWithGoogle(redirectUrl);
}

export async function signInWithGoogleIdToken(provider: string, token: string) {
    const authProvider = new SupabaseAuthenticationProvider();
    await authProvider.signInWithGoogleIdToken(provider, token);
}

export async function signOut() {
    const authProvider = new SupabaseAuthenticationProvider();
    await authProvider.signOut();
}
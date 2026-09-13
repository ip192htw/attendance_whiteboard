import { SupabaseAuthenticationProvider } from "@/src/infra/supabase/SupabaseAuthProvider";

const authProvider = new SupabaseAuthenticationProvider();

export async function signInWithGoogle() {
    await authProvider.signInWithGoogle();
}

export async function signInWithGoogleIdToken(provider: string, token: string) {
    await authProvider.signInWithGoogleIdToken(provider, token);
}

export async function signOut() {
    await authProvider.signOut();
}
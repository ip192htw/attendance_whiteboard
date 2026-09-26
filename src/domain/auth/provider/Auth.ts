export interface AuthenticationProvider {

    signInWithGoogle(redirectUrl: string): Promise<void>;

    signInWithGoogleIdToken(
        provider: string,
        token: string,
    ): Promise<void>;


    signOut(): Promise<void>;

    refreshSession(): Promise<void>;

}
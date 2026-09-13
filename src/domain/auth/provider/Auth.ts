export interface AuthenticationProvider {

    signInWithGoogle(): Promise<void>;

    signInWithGoogleIdToken(
        provider: string,
        token: string,
    ): Promise<void>;


    signOut(): Promise<void>;

    refreshSession(): Promise<void>;

}
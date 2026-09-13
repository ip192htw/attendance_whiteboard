

export interface SessionProvider {

    exchangeCodeForSession(code: string): Promise<void>;

}
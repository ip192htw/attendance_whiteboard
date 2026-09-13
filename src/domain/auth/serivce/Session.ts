import { SessionProvider, UserProvider } from "../provider";
import { ProfileRepository } from "../../identity";


export interface SessionService {

    exchangeCodeForSession(code: string): Promise<void>;

}


class DefaultSessionService implements SessionService {

    constructor(
        private readonly sessionProvider: SessionProvider,
        private readonly userProvider: UserProvider,
        private readonly profileRepository: ProfileRepository,
    ) {}

    async exchangeCodeForSession(code: string): Promise<void> {
        await this.sessionProvider.exchangeCodeForSession(code);

        const user = await this.userProvider.get();

        if (!user?.email) {
            console.log("User has no email or is not logged in.");
            return;
        }

        const profile = await this.profileRepository.getUserByEmail(user.email);
        

        if (!profile) return;

        console.log("User profile found in the repository:", profile);

        if (profile.auth_user_id !== user.id) {
            console.log("Updating user profile with auth_user_id:", user.id);
            profile.auth_user_id = user.id;
            await this.profileRepository.update(profile);
        }
    }

}

export function createSessionService(
    sessionProvider: SessionProvider,
    userProvider: UserProvider,
    profileRepository: ProfileRepository
): SessionService {
    return new DefaultSessionService(
        sessionProvider,
        userProvider,
        profileRepository
    );
}
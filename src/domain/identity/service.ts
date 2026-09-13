import { Profile } from "./types";
import { ProfileRepository } from "./repository";

import type { UserProvider } from "../auth/provider";


export interface Currentuser {
    get(): Promise<Profile | null>;
}


class DefaultCurrentUser 
    implements Currentuser {

    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly userProvider: UserProvider
    ) {}

    async get(): Promise<Profile | null> {
        const user = await this.userProvider.get();

        if (!user?.email) {
            return null;
        }

        const profile = await this.profileRepository.getUserByEmail(user.email!);

        if (!profile) {
            return {
                email: "",
                auth_user_id: "",
                name: "",
                role: "",
                class: "",
                created_at: "",
                updated_at: ""
            };
        }

        return profile;
    }


}

export function createCurrentUser(
    profileRepository: ProfileRepository,
    userProvider: UserProvider
): Currentuser {
    return new DefaultCurrentUser(profileRepository, userProvider);
}
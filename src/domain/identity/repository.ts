import { Profile, ProfileQuery, ProfileList, Role } from "./types";


export interface ProfileRepository {

    getUserByEmail(email: string): Promise<Profile | null>;

    getUsersByRole(role: Role): Promise<Profile[]>;

    getUsers(): Promise<Profile[]>;

    find(query: ProfileQuery): Promise<ProfileList>;

    create(profile: Profile): Promise<void>;

    createMany(profiles: Profile[]): Promise<void>;

    update(profile: Profile): Promise<void>;

    delete(email: string): Promise<void>;

    deleteMany(emails: string[]): Promise<void>;

    deletebyRole(role: Role): Promise<void>;
}



import { Profile, ProfileQuery, ProfileList } from "./types";

export interface ProfileRepository {

    getUserByID(id: string): Promise<Profile>;

    getUserByEmail(email: string): Promise<Profile>;

    getUsersByRole(role: string): Promise<Profile>;

    getUsers(): Promise<Profile[]>;

    find(query: ProfileQuery): Promise<ProfileList>;

    create(profile: Profile): Promise<void>;

    createMany(profiles: Profile[]): Promise<void>;

    update(id: string, profile: Profile): Promise<void>;

    delete(id: string): Promise<void>;

    deleteMany(ids: string[]): Promise<void>;
}

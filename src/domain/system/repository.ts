import { Setting } from "./types";

export interface SettingsRepository {

    get(key: string): Promise<Setting | null>;

    getMany(keys: string[]): Promise<Setting[]>;

    getAll(): Promise<Setting[]>;

    set(setting: Setting): Promise<void>;

    setMany(settings: Setting[]): Promise<void>;

}
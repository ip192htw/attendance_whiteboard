import { Setting } from "./types";

export interface SettingRepository {

    get(key: string): Promise<Setting>;

    getMany(keys: string[]): Promise<Setting[]>;

    set(setting: Setting): Promise<void>;

    setMany(settings: Setting[]): Promise<void>;

}
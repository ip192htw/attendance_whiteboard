import type { User } from "@supabase/supabase-js";

export interface UserProvider {

    get(): Promise<User | null>;

}
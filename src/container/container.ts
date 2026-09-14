"server-only";

import { cache } from 'react';

import { createClient } from "@/utils/supabase/server";

import {
    Currentuser,
    createCurrentUser
} from '../domain/identity';

import {
    SessionService,
    createSessionService
} from '../domain/auth/serivce/Session';

import {
    SettingsService,
    createSettingsService
} from "../domain/system";


import {
    SupabaseUserProvider,
    SupabaseProfileRepository,
    SupabaseSessionProvider,
    SupabaseSettingsRepository
} from '../infra/supabase';

export interface Container {

    currentUser: Currentuser;

    sessionService: SessionService;

    settingsService: SettingsService;

}



export const createContainer = cache(async (): Promise<Container> => {

    const supabase = await createClient();

    const profileRepository = new SupabaseProfileRepository(supabase);
    const settingsRepository = new SupabaseSettingsRepository(supabase);

    const userProvider = new SupabaseUserProvider(supabase);
    const sessionProvider = new SupabaseSessionProvider(supabase);

    const currentUser = createCurrentUser(profileRepository, userProvider);

    const sessionService = createSessionService(sessionProvider, userProvider, profileRepository);

    const settingsService = createSettingsService(settingsRepository);

    return {
        currentUser,
        sessionService,
        settingsService
    };


})
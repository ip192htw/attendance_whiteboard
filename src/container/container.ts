"server-only";

import { cache } from 'react';

import { createClient } from "@/utils/supabase/server";

import { Currentuser, createCurrentUser } from '../domain/identity';
import { SessionService, createSessionService } from '../domain/auth/serivce/Session';


import {
    SupabaseUserProvider,
    SupabaseProfileRepository,
    SupabaseSessionProvider
} from '../infra/supabase';

export interface Container {

    currentUser: Currentuser;

    sessionService: SessionService;

}

export const createContainer = cache(async (): Promise<Container> => {

    const supabase = await createClient();

    const profileRepository = new SupabaseProfileRepository(supabase);

    const userProvider = new SupabaseUserProvider(supabase);

    const currentUser = createCurrentUser(profileRepository, userProvider);

    const sessionProvider = new SupabaseSessionProvider(supabase);

    const sessionService = createSessionService(sessionProvider, userProvider, profileRepository);

    return {
        currentUser,
        sessionService
    };


})
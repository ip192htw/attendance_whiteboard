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
    SystemService,
    createSystemService
} from "../domain/system";

import {
    ReportService,
    createReportService
} from '../domain/attendance';


import {
    SupabaseUserProvider,
    SupabaseProfileRepository,
    SupabaseSessionProvider,
    SupabaseSettingsRepository,
    SupabaseReportRepository
} from '../infra/supabase';

export interface Container {

    currentUser: Currentuser;

    sessionService: SessionService;

    settingsService: SystemService;

    reportService: ReportService;

}



export const createContainer = cache(async (): Promise<Container> => {

    const supabase = await createClient();

    const profileRepository = new SupabaseProfileRepository(supabase);
    const settingsRepository = new SupabaseSettingsRepository(supabase);
    const reportRepository = new SupabaseReportRepository(supabase);

    const userProvider = new SupabaseUserProvider(supabase);
    const sessionProvider = new SupabaseSessionProvider(supabase);

    const currentUser = createCurrentUser(profileRepository, userProvider);

    const sessionService = createSessionService(sessionProvider, userProvider, profileRepository);

    const settingsService = createSystemService(settingsRepository);

    const reportService = createReportService(reportRepository);

    return {
        currentUser,
        sessionService,
        settingsService,
        reportService
    };


})
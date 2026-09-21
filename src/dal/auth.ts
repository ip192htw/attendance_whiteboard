import "server-only";

import { createClient } from "@/utils/supabase/server";

import type { Role } from "@/src/domain/identity";
import { UnauthorizedError, ForbiddenError } from "./errors";

import { cache } from "react";


export const requireUser = cache(async function requireUser() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
        throw new UnauthorizedError();
    }

    const { data: appUser, error } = await supabase
        .schema("identity")
        .from("users")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

    if (error || !appUser) {
        throw new ForbiddenError();
    }

    return appUser;
})


export async function requireRole(
    roles: Role[],
) {
    const user = await requireUser();

    if (!roles.includes(user.role)) {
        throw new ForbiddenError();
    }

    return user;
}

export async function requireInstructor() {
    return requireRole(["instructor", "supervisor"]);
}

export async function requireSupervisor() {
    return requireRole(["supervisor"]);
}
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(
    request: NextRequest,
): Promise<NextResponse> {
    let response = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },

                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => {
                        request.cookies.set(name, value);
                    });

                    response = NextResponse.next({
                        request,
                    });

                    cookiesToSet.forEach(
                        ({ name, value, options }) => {
                            response.cookies.set(
                                name,
                                value,
                                options,
                            );
                        },
                    );
                },
            },
        },
    );

    // Do not run code between createServerClient and
    // supabase.auth.getClaims(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.
    // IMPORTANT: If you remove getClaims() and you use server-side rendering
    // with the Supabase client, your users may be randomly logged out.

    const { data } = await supabase.auth.getClaims();

    const { pathname } = request.nextUrl;

    const user = data?.claims;

    const isProtected =
        pathname === "/" ||
        pathname.startsWith("/manage");

    if (isProtected && !user) {
        return NextResponse.redirect(
            new URL("/login?redirect_to=" + request.nextUrl, request.url),
        );
    }

    return response;
}
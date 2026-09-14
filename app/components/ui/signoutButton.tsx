'use client'


import { signOut } from "@/app/actions/auth"

import { redirect } from "next/navigation"

export function SignOutButton() {

    const handleSignOut = async () => {
        await signOut()
        redirect("/login")
    }

    return (
        <div className="mt-6 pt-4 flex items-center justify-between text-secondary border-t border-outline-variant/40">
            <button
                onClick={handleSignOut}
                className="px-8 py-3 w-full rounded-lg bg-primary-container text-on-primary font-headline-sm text-headline-sm font-semibold hover:bg-primary shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
                <span className="material-symbols-outlined text-[20px]">logout</span>
                <span>登出</span>
            </button>
        </div>
    )
}
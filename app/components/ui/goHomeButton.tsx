import Link from "next/link";

export function GoHomeButton() {

    return (
        <div className="mt-6 pt-4 flex items-center justify-between text-secondary border-t border-outline-variant/40">
            <Link
                href="/"
                className="px-8 py-3 w-full rounded-lg bg-primary-container text-on-primary font-headline-sm text-headline-sm font-semibold hover:bg-primary shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >                
                <span className="material-symbols-outlined text-[18px]">home</span>
                <span>回首頁</span>
            </Link>
        </div>
    )
}
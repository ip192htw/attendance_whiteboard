import { SignOutButton } from "./components/ui";

export default function ForbiddenPage() {

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex items-center justify-center p-space-xl relative overflow-hidden">
      {/* Floating Background Academic Accent */}
      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl pointer-events-none" />

      {/* Center Hero Card Container */}
      <div className="relative w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-md p-space-xl sm:p-12 overflow-hidden border border-outline-variant">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-surface-container-high via-primary-container to-surface-container-high" />

        <div className="flex flex-col items-center text-center max-w-xl mx-auto">
          <div className="font-display text-7xl sm:text-8xl font-bold text-primary-container tracking-tight mb-space-xs select-none">
            401
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-space-sm tracking-tight font-bold">
            帳號未啟用
          </h1>

          <p className="font-body-lg text-body-lg text-secondary mb-space-lg leading-relaxed">
            您的帳號目前尚未啟用。
          </p>

          <div className="w-full bg-surface-container-low rounded-lg p-space-lg text-left border-l-4 border-primary-container mb-space-lg">
            <div className="flex items-center gap-space-xs text-primary-container font-label-md text-label-md mb-space-xs">
              <span className="material-symbols-outlined text-[18px]">
                help_center
              </span>
              <span className="font-semibold">權限異動與申訴說明</span>
            </div>
            <p className="text-on-surface-variant font-body-sm text-body-sm leading-relaxed">
              啟用帳號請洽學務處生輔組
            </p>
          </div>
          <SignOutButton />
          
        </div>
      </div>

    </div>
  );
}

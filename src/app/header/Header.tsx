import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-[#e7d6bf]/80 bg-[#f8f2e8]/78 backdrop-blur-xl">
      <div className="mx-auto flex h-[88px] w-full max-w-[1580px] items-center justify-between px-5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1f3142] text-[15px] font-semibold tracking-[0.18em] text-[#f3c58a] shadow-[0_14px_30px_rgba(31,49,66,0.18)]">
            QZ
          </div>
          <div>
            <div className="font-[family:var(--font-display)] text-[26px] font-semibold tracking-[0.01em] text-[#1f1a17]">
              Quiz Atelier
            </div>
            <div className="text-[11px] font-semibold tracking-[0.22em] text-[#8d6f52] uppercase">
              Read. Distill. Challenge.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {hasClerk ? (
            <>
              <SignedOut>
                <SignInButton>
                  <button className="h-11 cursor-pointer rounded-full border border-[#d8c1a1] bg-white/70 px-5 text-sm font-semibold tracking-[0.08em] text-[#3d3127] uppercase transition-colors hover:bg-white">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="h-11 cursor-pointer rounded-full bg-[#1f3142] px-5 text-sm font-semibold tracking-[0.08em] text-[#f5e8d5] uppercase shadow-[0_16px_28px_rgba(31,49,66,0.16)] transition-colors hover:bg-[#182736]">
                    Start Free
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </>
          ) : (
            <div className="rounded-full border border-[#d8c1a1] bg-white/70 px-4 py-2 text-[11px] font-semibold tracking-[0.2em] text-[#8d6f52] uppercase">
              Demo mode
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

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
    <header className="sticky top-0 z-20 flex h-[73px] w-full items-center justify-between border-b border-emerald-950/10 bg-[#12312d]/92 px-5 text-[#f8f2e7] shadow-[0_10px_30px_rgba(18,49,45,0.24)] backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-4">
        <div className="font-[family:var(--font-display)] text-[24px] font-semibold tracking-[0.01em] text-[#f8f2e7]">
          Quiz app
        </div>
      </div>
      <div className="flex items-center gap-3">
        {hasClerk ? (
          <>
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="h-10 cursor-pointer rounded-full bg-[#f1a94e] px-5 text-sm font-semibold tracking-[0.04em] text-[#1e2f2b] uppercase transition-colors hover:bg-[#e79a38]">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </>
        ) : null}
      </div>
    </header>
  );
}

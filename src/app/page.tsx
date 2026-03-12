"use client";
import { AppSidebar } from "./_components/AppSidebar";
import { Header } from "./header/Header";
import SwitchCards from "./_components/SwitchCards";
import { useState } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function Home() {
  const [step, setStep] = useState<number>(1);
  const [selectedArticleId, setSelectedArticleId] = useState<string>("");

  const signedInContent = (
    <div className="mx-auto flex min-h-[calc(100vh-88px)] w-full max-w-[1580px] gap-4 px-3 pb-6 pt-4 sm:px-5 sm:pb-8 sm:pt-5 lg:gap-6 lg:px-7">
      <AppSidebar
        setStep={setStep}
        setSelectedArticleId={setSelectedArticleId}
        selectedArticleId={selectedArticleId}
      />
      <main className="relative min-w-0 flex-1 overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(145deg,rgba(255,251,245,0.95),rgba(245,236,221,0.9))] shadow-[0_32px_90px_rgba(41,29,18,0.12)]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-36 bg-[radial-gradient(circle_at_top,rgba(196,133,72,0.22),transparent_70%)]" />
        <div className="pointer-events-none absolute -right-10 top-14 h-40 w-40 rounded-full bg-[#c6864c]/10 blur-3xl" />
        <div className="relative flex justify-center px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <SwitchCards
            step={step}
            setStep={setStep}
            selectedArticleId={selectedArticleId}
          />
        </div>
      </main>
    </div>
  );

  const signedOutContent = (
    <div className="mx-auto flex min-h-[calc(100vh-88px)] max-w-[1580px] items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <Card className="w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(160deg,rgba(17,25,37,0.92),rgba(35,48,63,0.88))] text-center shadow-[0_32px_90px_rgba(13,18,27,0.28)] backdrop-blur">
        <div className="h-2 bg-[linear-gradient(90deg,#f3c58a_0%,#c6864c_45%,#7d5fff_100%)]" />
        <CardHeader className="gap-3 px-8 py-10">
          <div className="mx-auto w-fit rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.24em] text-[#f3c58a] uppercase">
            Members access
          </div>
          <CardTitle className="font-[family:var(--font-display)] text-3xl font-semibold tracking-[0.01em] text-white">
            Sign in required
          </CardTitle>
          <CardDescription className="mx-auto max-w-[30ch] text-[15px] leading-7 text-slate-300">
            You need to be singed in to continue.
            <br />
            Please sign in to access this feature.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,rgba(198,134,76,0.22),transparent_30%),radial-gradient(circle_at_85%_12%,rgba(65,90,119,0.16),transparent_22%),linear-gradient(180deg,#f7f2e8_0%,#efe3d2_46%,#e4d2bc_100%)]">
      <div className="pointer-events-none fixed inset-0 opacity-50 [background-image:linear-gradient(rgba(92,66,38,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(92,66,38,0.04)_1px,transparent_1px)] [background-size:32px_32px]" />
      <Header />
      {hasClerk ? (
        <>
          <SignedIn>{signedInContent}</SignedIn>
          <SignedOut>{signedOutContent}</SignedOut>
        </>
      ) : (
        signedInContent
      )}
    </div>
  );
}

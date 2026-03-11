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

export default function Home() {
  const [step, setStep] = useState<number>(1);
  const [selectedArticleId, setSelectedArticleId] = useState<string>("");

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_rgba(253,186,116,0.22),_transparent_28%),linear-gradient(180deg,_#fffaf2_0%,_#f3efe4_48%,_#ebe6d8_100%)]">
      <Header />
      <SignedIn>
        <div className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-[1600px]">
          <AppSidebar
            setStep={setStep}
            setSelectedArticleId={setSelectedArticleId}
            selectedArticleId={selectedArticleId}
          />
          <main className="flex min-w-0 flex-1 justify-center px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            <SwitchCards
              step={step}
              setStep={setStep}
              selectedArticleId={selectedArticleId}
            />
          </main>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-10">
          <Card className="w-full max-w-sm border border-amber-200/70 bg-[#fffaf0]/95 text-center shadow-[0_22px_60px_rgba(73,52,24,0.14)] backdrop-blur">
            <CardHeader className="gap-2">
              <CardTitle className="font-[family:var(--font-display)] text-2xl font-semibold tracking-[0.01em] text-stone-900">
                Sign in required 🔒
              </CardTitle>
              <CardDescription className="mx-auto max-w-[28ch] text-[15px] leading-7 text-stone-600">
                You need to be singed in to continue.
                <br />
                Please sign in to access this feature.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </SignedOut>
    </div>
  );
}

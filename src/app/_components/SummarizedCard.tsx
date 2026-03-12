"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GeminiIcon from "../icons/GeminiIcon";
import BookIcon from "../icons/BookIcon";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { QuizQuestion } from "./quiz-utils";

type SummarizedCardProps = {
  quiz: QuizQuestion[];
  setQuiz: React.Dispatch<React.SetStateAction<QuizQuestion[]>>;
  summary: string;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  content: string;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  articleId: string;
};

export default function SummarizedCard({
  setQuiz,
  summary,
  title,
  content,
  setStep,
  articleId,
}: SummarizedCardProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const handleTakeQuiz = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (loading) return;
    if (!articleId) {
      console.error("articleId is missing");
      return;
    }

    setLoading(true);

    try {
      const quizRes = await axios.post(`/api/article/${articleId}/quizzes`);

      console.log("quiz saved:", quizRes.data);

      const quizzes = quizRes.data.quizzes;

      if (!Array.isArray(quizzes) || quizzes.length === 0) {
        console.error("No quizzes returned:", quizzes);
        return;
      }

      setQuiz(quizzes);
      setStep(3);
    } catch (err: unknown) {
      const axiosError = err as {
        response?: { data?: unknown };
        message?: string;
      };

      console.error(
        "HANDLE TAKE QUIZ ERROR:",
        axiosError?.response?.data || axiosError?.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full overflow-hidden rounded-[2rem] border border-white/70 bg-[linear-gradient(160deg,rgba(255,253,248,0.98),rgba(240,230,213,0.96))] shadow-[0_36px_90px_rgba(43,31,19,0.12)]">
      <div className="h-2 bg-[linear-gradient(90deg,#c6864c_0%,#f3c58a_46%,#1f3142_100%)]" />
      <CardHeader className="space-y-4 px-6 pb-0 pt-6 sm:px-8 sm:pt-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <GeminiIcon />
              <div className="rounded-full border border-[#d9c2a2] bg-[#fff8ef] px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-[#8d6f52] uppercase">
                Summary
              </div>
            </div>
            <CardTitle className="font-[family:var(--font-display)] text-[2.1rem] font-semibold leading-none tracking-[0.01em] text-[#211915] sm:text-[2.4rem]">
              Refined article, ready for a challenge
            </CardTitle>
          </div>
          <div className="rounded-[1.5rem] border border-[#dec6a8] bg-white/65 px-4 py-3 text-right shadow-[0_14px_30px_rgba(140,105,69,0.08)]">
            <div className="text-[11px] font-semibold tracking-[0.22em] text-[#8d6f52] uppercase">
              Next step
            </div>
            <div className="mt-1 text-sm text-[#3f342b]">
              Review summary
              <br />
              Inspect source
              <br />
              Generate quiz
            </div>
          </div>
        </div>
        <CardDescription className="text-[15px] leading-7 text-stone-600">
          Your article has been summarized. Review it, then generate a quiz.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-6 py-6 sm:px-8">
        <CardDescription className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.12em] text-[#8d6f52] uppercase">
          <BookIcon /> Summarized content
        </CardDescription>

        <div className="font-[family:var(--font-display)] text-[2rem] font-semibold leading-9 tracking-[0.01em] text-[#211915]">
          {title}
        </div>

        <div className="max-h-[360px] overflow-y-auto rounded-[1.6rem] border border-[#e1c8a8] bg-white/72 p-5 text-[15px] leading-7 text-stone-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
          {summary}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-3 px-6 pb-6 pt-0 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:pb-8">
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-12 w-full cursor-pointer rounded-full border-[#d8c1a1] bg-white/72 px-5 text-[13px] font-semibold tracking-[0.16em] text-[#3d3127] uppercase transition-colors hover:bg-white sm:w-auto"
              >
                See content
              </Button>
            </DialogTrigger>

            <DialogContent className="border-[#e5cda4] bg-[#fffaf2] p-6 shadow-[0_34px_90px_rgba(42,30,18,0.24)] sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle className="font-[family:var(--font-display)] text-[2rem] font-semibold tracking-[0.01em] text-stone-950">
                  {title}
                </DialogTitle>
                <div className="max-h-[60vh] overflow-y-auto pt-2 text-[15px] leading-7 text-stone-700">
                  {content}
                </div>
              </DialogHeader>
            </DialogContent>
          </form>
        </Dialog>

        <Button
          type="button"
          className="h-12 w-full cursor-pointer rounded-full bg-[#1f3142] px-6 text-[13px] font-semibold tracking-[0.18em] text-[#f5e8d5] uppercase shadow-[0_18px_38px_rgba(31,49,66,0.2)] transition-colors hover:bg-[#182736] disabled:bg-stone-300 sm:w-auto"
          disabled={loading || !articleId}
          onClick={handleTakeQuiz}
        >
          {loading ? "Take a quiz..." : "Take a quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}

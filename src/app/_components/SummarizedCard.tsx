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
    <Card className="w-full rounded-[2rem] border border-amber-200/70 bg-[linear-gradient(180deg,rgba(255,250,240,0.98)_0%,rgba(245,237,220,0.98)_100%)] shadow-[0_30px_80px_rgba(92,66,28,0.14)]">
      <CardHeader className="space-y-3 px-6 pb-0 pt-6 sm:px-8 sm:pt-8">
        <div className="flex items-center gap-2.5">
          <GeminiIcon />
          <CardTitle className="font-[family:var(--font-display)] text-[2rem] font-semibold leading-none tracking-[0.01em] text-stone-950 sm:text-[2.15rem]">
            Article Quiz Generator
          </CardTitle>
        </div>
        <CardDescription className="text-[15px] leading-7 text-stone-600">
          Your article has been summarized. Review it, then generate a quiz.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 px-6 py-6 sm:px-8">
        <CardDescription className="flex items-center gap-2 text-[13px] font-semibold tracking-[0.12em] text-stone-600 uppercase">
          <BookIcon /> Summarized content
        </CardDescription>

        <div className="font-[family:var(--font-display)] text-[2rem] font-semibold leading-9 tracking-[0.01em] text-stone-950">
          {title}
        </div>

        <div className="max-h-[360px] overflow-y-auto rounded-2xl border border-[#e5cda4] bg-[#fff8ee]/85 p-4 text-[15px] leading-7 text-stone-700">
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
                className="h-11 w-full cursor-pointer rounded-xl border-stone-300 bg-[#fffaf2] text-[13px] font-semibold tracking-[0.12em] text-stone-700 uppercase transition-colors hover:bg-[#f1e3c5] sm:w-auto"
              >
                See content
              </Button>
            </DialogTrigger>

            <DialogContent className="border-[#e5cda4] bg-[#fffaf2] p-6 sm:max-w-3xl">
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
          className="h-11 w-full cursor-pointer rounded-xl bg-[#1c5c52] px-5 text-[13px] font-semibold tracking-[0.12em] text-[#f8f2e7] uppercase transition-colors hover:bg-[#144840] disabled:bg-stone-300 sm:w-auto"
          disabled={loading || !articleId}
          onClick={handleTakeQuiz}
        >
          {loading ? "Take a quiz..." : "Take a quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
}

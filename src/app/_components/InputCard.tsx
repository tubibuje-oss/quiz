"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GeminiIcon from "../icons/GeminiIcon";
import FileIcon from "../icons/FileIcon";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import axios from "axios";

type InputCardProps = {
  summary: string;
  setSummary: React.Dispatch<React.SetStateAction<string>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  setArticleId: React.Dispatch<React.SetStateAction<string>>;
};

export default function InputCard({
  setSummary,
  title,
  setTitle,
  content,
  setContent,
  setStep,
  setArticleId,
}: InputCardProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const getAxiosErrorDetails = (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      return null;
    }

    const responseError = error.response?.data as
      | { error?: string; message?: string; status?: number }
      | undefined;

    return {
      status: error.response?.status,
      code: error.code,
      message:
        responseError?.error ||
        responseError?.message ||
        error.message ||
        "Generate хийхэд алдаа гарлаа",
      data: responseError,
    };
  };

  const getErrorMessage = (error: unknown) => {
    const axiosDetails = getAxiosErrorDetails(error);
    if (axiosDetails) {
      return axiosDetails.message;
    }

    return error instanceof Error ? error.message : "Generate хийхэд алдаа гарлаа";
  };

  const handleGenerate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!title || !content) return;

    setErrorMessage("");
    setLoading(true);
    try {
      console.log("generate payload:", { title, content });
      const generateRes = await axios.post("/api/generate", {
        content,
      });

      const generatedSummary = generateRes.data.result;

      const articleRes = await axios.post("/api/articles", {
        title,
        content,
        summary: generatedSummary,
      });

      const newArticleId = articleRes.data?.article?.id;

      if (!newArticleId) {
        throw new Error("Article ID not returned from /api/articles");
      }

      setSummary(generatedSummary);
      setArticleId(newArticleId);

      console.log("article saved", articleRes.data);
      console.log("newArticleId", newArticleId);

      setStep(2);
    } catch (err: unknown) {
      const axiosDetails = getAxiosErrorDetails(err);

      console.error("HANDLE GENERATE ERROR FULL:", err);
      console.error("HANDLE GENERATE ERROR STATUS:", axiosDetails?.status);
      console.error("HANDLE GENERATE ERROR CODE:", axiosDetails?.code);
      console.error("HANDLE GENERATE ERROR MESSAGE:", axiosDetails?.message);
      console.error("HANDLE GENERATE ERROR DATA:", axiosDetails?.data);

      setErrorMessage(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full rounded-[2rem] border border-amber-200/70 bg-[linear-gradient(180deg,rgba(255,250,240,0.98)_0%,rgba(248,239,221,0.98)_100%)] shadow-[0_30px_80px_rgba(92,66,28,0.14)]">
      <CardHeader className="space-y-3 px-6 pb-0 pt-6 sm:px-8 sm:pt-8">
        <div className="flex items-center gap-2.5">
          <GeminiIcon />
          <CardTitle className="font-[family:var(--font-display)] text-[2rem] font-semibold leading-none tracking-[0.01em] text-stone-950 sm:text-[2.15rem]">
            Article Quiz Generator
          </CardTitle>
        </div>
        <CardDescription className="max-w-2xl text-[15px] leading-7 text-stone-600">
          Paste your article below to generate a summarize and quiz question.
          Your articles will saved in the sidebar for future reference.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 py-6 sm:px-8">
        <form>
          <div className="flex flex-col gap-7">
            {errorMessage ? (
              <div className="rounded-2xl border border-rose-300/70 bg-rose-50/90 px-4 py-3 text-sm leading-6 text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <div className="grid gap-2.5">
              <div className="flex items-center gap-1.5">
                <FileIcon />
                <Label htmlFor="title" className="text-[13px] font-semibold tracking-[0.12em] text-stone-700 uppercase">
                  Article Title
                </Label>
              </div>
              <Input
                id="title"
                type="text"
                placeholder="Enter a title for your article..."
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errorMessage) {
                    setErrorMessage("");
                  }
                }}
                className="h-12 rounded-xl border-stone-300 bg-[#fffdf8] px-4 text-[15px] text-stone-900 shadow-none placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-[#d38a2c]/35"
              />
            </div>

            <div className="grid gap-2.5">
              <div className="flex items-center gap-1.5">
                <FileIcon />
                <Label htmlFor="content" className="text-[13px] font-semibold tracking-[0.12em] text-stone-700 uppercase">
                  Article Content
                </Label>
              </div>
              <Textarea
                id="content"
                required
                placeholder="Paste your article content here..."
                value={content}
                className="min-h-[260px] rounded-2xl border-stone-300 bg-[#fffdf8] px-4 py-3 text-[15px] leading-7 text-stone-900 shadow-none placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-[#d38a2c]/35"
                onChange={(e) => {
                  setContent(e.target.value);
                  if (errorMessage) {
                    setErrorMessage("");
                  }
                }}
              />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter className="justify-end px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
        <Button
          type="button"
          className="h-11 rounded-xl bg-[#1c5c52] px-5 text-[13px] font-semibold tracking-[0.12em] text-[#f8f2e7] uppercase shadow-[0_18px_36px_rgba(28,92,82,0.2)] transition-colors hover:bg-[#144840] disabled:bg-stone-300"
          disabled={!title || !content || loading}
          onClick={handleGenerate}
        >
          {loading ? "Generate summary..." : "Generate summary"}
        </Button>
      </CardFooter>
    </Card>
  );
}

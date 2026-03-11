import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

type GenerateBody = {
  content?: string;
};

function hasMessageDetails(error: unknown): error is {
  message?: string;
  status?: number;
  statusText?: string;
  stack?: string;
} {
  return (
    typeof error === "object" &&
    error !== null &&
    ("message" in error || "status" in error || "statusText" in error)
  );
}

function getErrorResponse(error: unknown) {
  if (hasMessageDetails(error)) {
    const apiError = error;
    const message =
      apiError.message || apiError.statusText || "Failed to generate summary";
    const lowerMessage = message.toLowerCase();

    if (
      apiError.status === 403 &&
      (lowerMessage.includes("reported as leaked") ||
        lowerMessage.includes("permission_denied"))
    ) {
      return {
        error:
          "Gemini API key blocked байна. Шинэ API key үүсгээд .env.local файлдаа солино уу.",
        status: 403,
        stack: apiError.stack,
      };
    }

    return {
      error: message,
      status: apiError.status || 500,
      stack: apiError.stack,
    };
  }

  return {
    error: "Failed to generate summary",
    status: 500,
    stack: undefined,
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is missing in .env" },
        { status: 500 },
      );
    }

    const body: GenerateBody = await request.json();
    const { content } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: "No message" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Please provide a concise summary of the following article: ${content}`,
    });

    return NextResponse.json({ result: response.text });
  } catch (err: unknown) {
    const errorResponse = getErrorResponse(err);
    console.error("GENERATE ERROR FULL:", err);
    console.error("GENERATE ERROR MESSAGE:", errorResponse.error);
    console.error("GENERATE ERROR STATUS:", errorResponse.status);
    console.error("GENERATE ERROR STACK:", errorResponse.stack);
    console.error("GENERATE ERROR RAW:", JSON.stringify(err, null, 2));

    return NextResponse.json(
      {
        error: errorResponse.error,
        status: errorResponse.status,
      },
      { status: errorResponse.status },
    );
  }
}

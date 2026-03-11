import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "failed to get article";
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ articleId: string }> },
) {
  try {
    const { articleId } = await context.params;

    const article = await prisma.article.findUnique({
      where: { id: articleId },
      include: { quizzes: true },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ article }, { status: 200 });
  } catch (err: unknown) {
    console.error("Article get error:", err);
    return NextResponse.json(
      { success: false, error: getErrorMessage(err) },
      { status: 500 },
    );
  }
}

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer?: string;
  answer?: string;
};

export type QuizResult = {
  question: string;
  selected: string;
  correct: string;
  isCorrect: boolean;
};

export function resolveCorrectAnswer(question: QuizQuestion): string {
  if (typeof question.correctAnswer === "string" && question.correctAnswer) {
    return question.correctAnswer;
  }

  if (typeof question.answer !== "string") {
    return "";
  }

  const trimmedAnswer = question.answer.trim();
  const parsedIndex = Number(trimmedAnswer);

  if (
    Number.isInteger(parsedIndex) &&
    parsedIndex >= 0 &&
    parsedIndex < question.options.length
  ) {
    return question.options[parsedIndex] ?? "";
  }

  return trimmedAnswer;
}

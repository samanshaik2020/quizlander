import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { submitAnswersSchema } from "@/lib/validations/quiz";

interface Option {
  id: string;
  is_correct: boolean;
}

interface Question {
  id: string;
  options: Option[];
}

// POST /api/play/[slug]/submit - Submit quiz answers
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();
    const body = await request.json();
    const { answers } = submitAnswersSchema.parse(body);

    // Get quiz
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("*")
      .eq("slug", slug)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (!quiz.is_public) {
      return NextResponse.json({ error: "Quiz is private" }, { status: 403 });
    }

    // Get questions with options (including is_correct for scoring)
    const { data: questions } = await supabase
      .from("questions")
      .select("id, options(id, is_correct)")
      .eq("quiz_id", quiz.id);

    // Calculate score
    let score = 0;
    const total = questions?.length || 0;

    for (const question of (questions || []) as Question[]) {
      const selectedOptionId = answers[question.id];
      if (selectedOptionId) {
        const selectedOption = question.options.find(
          (opt: Option) => opt.id === selectedOptionId
        );
        if (selectedOption?.is_correct) {
          score++;
        }
      }
    }

    // Store attempt
    await supabase.from("attempts").insert({
      quiz_id: quiz.id,
      answers,
      score,
      total,
    });

    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    return NextResponse.json({
      score,
      total,
      percentage,
      finalPage: quiz.final_page,
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}

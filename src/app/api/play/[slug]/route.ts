import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Option {
  id: string;
  text: string;
  order: number;
}

interface Question {
  id: string;
  text: string;
  order: number;
  options: Option[];
}

// GET /api/play/[slug] - Get quiz for playing (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

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

    // Get questions with options (excluding is_correct for security)
    const { data: questions } = await supabase
      .from("questions")
      .select("id, text, order, options(id, text, order)")
      .eq("quiz_id", quiz.id)
      .order("order", { ascending: true });

    // Sort options by order
    const questionsWithSortedOptions = questions?.map((q: Question) => ({
      id: q.id,
      text: q.text,
      order: q.order,
      options: q.options?.sort((a: Option, b: Option) => a.order - b.order) || [],
    }));

    // Return quiz without sensitive data
    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      questions: questionsWithSortedOptions || [],
      finalPage: quiz.final_page,
    });
  } catch (error) {
    console.error("Error fetching quiz for play:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

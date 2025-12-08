import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Option {
  text: string;
  is_correct: boolean;
  order: number;
}

interface Question {
  text: string;
  order: number;
  options: Option[];
}

// GET /api/quizzes/[quizId]/export - Export quiz as JSON
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ quizId: string }> }
) {
  try {
    const { quizId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get quiz
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", quizId)
      .single();

    if (quizError || !quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.author_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get questions with options
    const { data: questions } = await supabase
      .from("questions")
      .select("*, options(*)")
      .eq("quiz_id", quizId)
      .order("order", { ascending: true });

    // Format for export
    const exportData = {
      title: quiz.title,
      description: quiz.description,
      isPublic: quiz.is_public,
      finalPage: quiz.final_page,
      questions: questions?.map((q: Question) => ({
        text: q.text,
        order: q.order,
        options: q.options
          ?.sort((a: Option, b: Option) => a.order - b.order)
          .map((o: Option) => ({
            text: o.text,
            isCorrect: o.is_correct,
            order: o.order,
          })),
      })) || [],
      exportedAt: new Date().toISOString(),
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${quiz.slug}-export.json"`,
      },
    });
  } catch (error) {
    console.error("Error exporting quiz:", error);
    return NextResponse.json(
      { error: "Failed to export quiz" },
      { status: 500 }
    );
  }
}

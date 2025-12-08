import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateQuizSchema } from "@/lib/validations/quiz";

// GET /api/quizzes/[quizId] - Get a single quiz with questions
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

    // Sort options by order
    const questionsWithSortedOptions = questions?.map((q) => ({
      ...q,
      options: q.options?.sort((a: { order: number }, b: { order: number }) => a.order - b.order) || [],
    }));

    return NextResponse.json({
      ...quiz,
      questions: questionsWithSortedOptions || [],
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz" },
      { status: 500 }
    );
  }
}

// PUT /api/quizzes/[quizId] - Update quiz
export async function PUT(
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

    const body = await request.json();
    const validatedData = updateQuizSchema.parse(body);

    const { questions, ...quizData } = validatedData;

    // Update quiz metadata
    const updateData: Record<string, unknown> = {};
    if (quizData.title !== undefined) updateData.title = quizData.title;
    if (quizData.description !== undefined) updateData.description = quizData.description;
    if (quizData.isPublic !== undefined) updateData.is_public = quizData.isPublic;
    if (quizData.finalPage !== undefined) updateData.final_page = quizData.finalPage;

    if (Object.keys(updateData).length > 0) {
      await supabase
        .from("quizzes")
        .update(updateData)
        .eq("id", quizId);
    }

    // If questions are provided, update them
    if (questions) {
      // Delete existing questions (cascade deletes options)
      await supabase.from("questions").delete().eq("quiz_id", quizId);

      // Insert new questions
      for (const question of questions) {
        const { data: newQuestion } = await supabase
          .from("questions")
          .insert({
            quiz_id: quizId,
            text: question.text,
            order: question.order,
          })
          .select()
          .single();

        if (newQuestion && question.options) {
          // Insert options for this question
          await supabase.from("options").insert(
            question.options.map((opt) => ({
              question_id: newQuestion.id,
              text: opt.text,
              is_correct: opt.isCorrect,
              order: opt.order,
            }))
          );
        }
      }
    }

    // Fetch updated quiz with questions
    const { data: updatedQuiz } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", quizId)
      .single();

    const { data: updatedQuestions } = await supabase
      .from("questions")
      .select("*, options(*)")
      .eq("quiz_id", quizId)
      .order("order", { ascending: true });

    const questionsWithSortedOptions = updatedQuestions?.map((q) => ({
      ...q,
      options: q.options?.sort((a: { order: number }, b: { order: number }) => a.order - b.order) || [],
    }));

    return NextResponse.json({
      ...updatedQuiz,
      questions: questionsWithSortedOptions || [],
    });
  } catch (error) {
    console.error("Error updating quiz:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update quiz" },
      { status: 500 }
    );
  }
}

// DELETE /api/quizzes/[quizId] - Delete quiz
export async function DELETE(
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

    await supabase.from("quizzes").delete().eq("id", quizId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json(
      { error: "Failed to delete quiz" },
      { status: 500 }
    );
  }
}

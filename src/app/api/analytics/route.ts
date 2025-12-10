import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/analytics - Get analytics for all user's quizzes
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all quizzes for the user
    const { data: quizzes } = await supabase
      .from("quizzes")
      .select("id, title")
      .eq("author_id", user.id);

    if (!quizzes || quizzes.length === 0) {
      return NextResponse.json({
        totalClicks: 0,
        totalAttempts: 0,
        quizAnalytics: [],
      });
    }

    const quizIds = quizzes.map((q) => q.id);

    // Get click counts per quiz
    const { data: clicks } = await supabase
      .from("link_clicks")
      .select("quiz_id, created_at")
      .in("quiz_id", quizIds);

    // Get attempt counts per quiz
    const { data: attempts } = await supabase
      .from("attempts")
      .select("quiz_id, created_at")
      .in("quiz_id", quizIds);

    // Aggregate data
    const clicksByQuiz: Record<string, number> = {};
    const attemptsByQuiz: Record<string, number> = {};

    clicks?.forEach((click) => {
      clicksByQuiz[click.quiz_id] = (clicksByQuiz[click.quiz_id] || 0) + 1;
    });

    attempts?.forEach((attempt) => {
      attemptsByQuiz[attempt.quiz_id] = (attemptsByQuiz[attempt.quiz_id] || 0) + 1;
    });

    const quizAnalytics = quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      clicks: clicksByQuiz[quiz.id] || 0,
      attempts: attemptsByQuiz[quiz.id] || 0,
      conversionRate: attemptsByQuiz[quiz.id]
        ? Math.round((clicksByQuiz[quiz.id] || 0) / attemptsByQuiz[quiz.id] * 100)
        : 0,
    }));

    // Sort by clicks descending
    quizAnalytics.sort((a, b) => b.clicks - a.clicks);

    return NextResponse.json({
      totalClicks: clicks?.length || 0,
      totalAttempts: attempts?.length || 0,
      quizAnalytics,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

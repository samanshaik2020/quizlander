import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createQuizSchema } from "@/lib/validations/quiz";
import { generateSlug } from "@/lib/slug";

// GET /api/quizzes - Get all quizzes for the current user
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get quizzes with question and attempt counts
    const { data: quizzes, error } = await supabase
      .from("quizzes")
      .select(`
        *,
        questions:questions(count),
        attempts:attempts(count)
      `)
      .eq("author_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    // Transform to include _count format
    const transformedQuizzes = quizzes?.map((quiz) => ({
      ...quiz,
      _count: {
        questions: quiz.questions?.[0]?.count || 0,
        attempts: quiz.attempts?.[0]?.count || 0,
      },
    }));

    return NextResponse.json(transformedQuizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

// POST /api/quizzes - Create a new quiz
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createQuizSchema.parse(body);

    // Ensure user exists in our database
    await supabase.from("users").upsert({
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.full_name || null,
      avatar_url: user.user_metadata?.avatar_url || null,
    });

    // Generate unique slug
    let slug = generateSlug();
    let { data: existingSlug } = await supabase
      .from("quizzes")
      .select("slug")
      .eq("slug", slug)
      .single();

    while (existingSlug) {
      slug = generateSlug();
      const result = await supabase
        .from("quizzes")
        .select("slug")
        .eq("slug", slug)
        .single();
      existingSlug = result.data;
    }

    const { data: quiz, error } = await supabase
      .from("quizzes")
      .insert({
        title: validatedData.title,
        description: validatedData.description || null,
        is_public: validatedData.isPublic,
        slug,
        author_id: user.id,
        final_page: {
          title: "Congratulations!",
          body: "You have completed the quiz.",
          buttonText: "Retake Quiz",
          buttonAction: "retake",
        },
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(quiz, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}

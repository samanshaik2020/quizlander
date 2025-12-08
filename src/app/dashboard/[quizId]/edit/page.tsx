import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import { QuizEditor } from "@/components/quiz/quiz-editor";

interface Option {
  id: string;
  text: string;
  is_correct: boolean;
  order: number;
}

interface Question {
  id: string;
  text: string;
  order: number;
  options: Option[];
}

interface EditQuizPageProps {
  params: Promise<{ quizId: string }>;
}

export default async function EditQuizPage({ params }: EditQuizPageProps) {
  const { quizId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get quiz
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("id", quizId)
    .single();

  if (quizError || !quiz) {
    notFound();
  }

  if (quiz.author_id !== user.id) {
    redirect("/dashboard");
  }

  // Get questions with options
  const { data: questions } = await supabase
    .from("questions")
    .select("*, options(*)")
    .eq("quiz_id", quizId)
    .order("order", { ascending: true });

  // Transform for client component
  const quizData = {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    slug: quiz.slug,
    isPublic: quiz.is_public,
    questions: (questions || []).map((q: Question) => ({
      id: q.id,
      text: q.text,
      order: q.order,
      options: (q.options || [])
        .sort((a: Option, b: Option) => a.order - b.order)
        .map((o: Option) => ({
          id: o.id,
          text: o.text,
          isCorrect: o.is_correct,
          order: o.order,
        })),
    })),
    finalPage: quiz.final_page as {
      title: string;
      body: string;
      buttonText: string;
      buttonAction: "retake" | "url";
      buttonUrl?: string;
    } | null,
  };

  return <QuizEditor quiz={quizData} />;
}

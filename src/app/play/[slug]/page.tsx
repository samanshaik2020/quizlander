import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { QuizPlayer } from "@/components/quiz/quiz-player";

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

interface PlayQuizPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PlayQuizPage({ params }: PlayQuizPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  // Get quiz
  const { data: quiz, error: quizError } = await supabase
    .from("quizzes")
    .select("*")
    .eq("slug", slug)
    .single();

  if (quizError || !quiz || !quiz.is_public) {
    notFound();
  }

  // Get questions with options (excluding is_correct for security)
  const { data: questions } = await supabase
    .from("questions")
    .select("id, text, order, options(id, text, order)")
    .eq("quiz_id", quiz.id)
    .order("order", { ascending: true });

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Quiz Not Ready</h1>
          <p className="text-muted-foreground">
            This quiz doesn&apos;t have any questions yet.
          </p>
        </div>
      </div>
    );
  }

  const quizData = {
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    questions: questions.map((q: Question) => ({
      id: q.id,
      text: q.text,
      order: q.order,
      options: (q.options || []).sort((a: Option, b: Option) => a.order - b.order),
    })),
    finalPage: quiz.final_page as {
      title: string;
      body: string;
      buttonText: string;
      buttonAction: "retake" | "url";
      buttonUrl?: string;
    } | null,
  };

  return <QuizPlayer quiz={quizData} slug={slug} />;
}

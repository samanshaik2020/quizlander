import { createClient } from "./server";

// Database types
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  is_public: boolean;
  author_id: string;
  final_page: FinalPage | null;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  quiz_id: string;
  order: number;
  text: string;
}

export interface Option {
  id: string;
  question_id: string;
  text: string;
  is_correct: boolean;
  order: number;
}

export interface Attempt {
  id: string;
  quiz_id: string;
  answers: Record<string, string>;
  score: number | null;
  total: number | null;
  created_at: string;
}

export interface FinalPage {
  title: string;
  body: string;
  buttonText: string;
  buttonAction: "retake" | "url";
  buttonUrl?: string;
}

// Quiz with relations
export interface QuizWithQuestions extends Quiz {
  questions: (Question & { options: Option[] })[];
}

export interface QuizWithCount extends Quiz {
  question_count: number;
  attempt_count: number;
}

// Database helper functions
export async function getDb() {
  return await createClient();
}

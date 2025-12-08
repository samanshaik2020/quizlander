export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

export interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
  order: number;
}

export interface Question {
  id: string;
  text: string;
  order: number;
  options: Option[];
}

export interface FinalPage {
  title: string;
  body: string;
  buttonText: string;
  buttonAction: "retake" | "url";
  buttonUrl?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  isPublic: boolean;
  authorId: string;
  author?: User;
  questions: Question[];
  finalPage: FinalPage | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizForPlay {
  id: string;
  title: string;
  description: string | null;
  questions: {
    id: string;
    text: string;
    order: number;
    options: {
      id: string;
      text: string;
      order: number;
    }[];
  }[];
  finalPage: FinalPage | null;
}

export interface Attempt {
  id: string;
  quizId: string;
  answers: Record<string, string>;
  score: number | null;
  total: number | null;
  createdAt: Date;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  finalPage: FinalPage | null;
}

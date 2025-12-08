"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  Sparkles,
  LogOut,
  Loader2,
  FileQuestion,
  BarChart3,
} from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { toast } from "sonner";

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  _count: {
    questions: number;
    attempts: number;
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchQuizzes();
    }
  }, [user, authLoading, router]);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes");
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async () => {
    setCreating(true);
    try {
      const response = await fetch("/api/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Untitled Quiz",
          description: "",
        }),
      });

      if (response.ok) {
        const quiz = await response.json();
        router.push(`/dashboard/${quiz.id}/edit`);
      } else {
        toast.error("Failed to create quiz");
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Failed to create quiz");
    } finally {
      setCreating(false);
    }
  };

  const deleteQuiz = async (quizId: string) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;

    try {
      const response = await fetch(`/api/quizzes/${quizId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
        toast.success("Quiz deleted");
      } else {
        toast.error("Failed to delete quiz");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
    }
  };

  const copyLink = async (slug: string) => {
    const url = `${window.location.origin}/play/${slug}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  // Card background colors that cycle through
  const cardColors = [
    "bg-[#FDF6ED]", // Light peach
    "bg-[#E0FFFF]", // Pale cyan
    "bg-[#FAFAD2]", // Light goldenrod
    "bg-[#E6E6FA]", // Lavender
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F0E3] dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF6F61]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F8F0E3] dark:bg-gray-900">
      {/* Header */}
      <header className="w-full border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-7 w-7 text-[#FF6F61]" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">QuizLander</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="text-gray-600 dark:text-gray-400 hover:text-[#FF6F61] dark:hover:text-[#FF6F61] transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          {/* Title Section */}
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">My Quizzes</h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Spark curiosity with engaging quizzes!
              </p>
            </div>
            <button
              onClick={createQuiz}
              disabled={creating}
              className="flex items-center gap-2 rounded-lg bg-[#FF6F61] px-6 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
              New Adventure
            </button>
          </div>

          {/* Quiz Grid */}
          {quizzes.length === 0 ? (
            <div className="rounded-2xl bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 p-16">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-[#FF6F61]/10 rounded-full flex items-center justify-center mb-6">
                  <Sparkles className="h-10 w-10 text-[#FF6F61]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No quizzes yet</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm">
                  Create your first quiz and start sharing it with the world!
                </p>
                <button
                  onClick={createQuiz}
                  disabled={creating}
                  className="flex items-center gap-2 rounded-lg bg-[#FF6F61] px-6 py-3 text-base font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {creating ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Plus className="h-5 w-5" />
                  )}
                  Create Your First Quiz
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {quizzes.map((quiz, index) => (
                <div
                  key={quiz.id}
                  className={`group relative flex flex-col justify-between rounded-2xl ${cardColors[index % cardColors.length]} dark:bg-gray-800 p-8 shadow-md transition-all hover:shadow-xl`}
                >
                  <div>
                    {/* Card Header */}
                    <div className="mb-5 flex items-start justify-between">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white pr-4">
                        {quiz.title}
                      </h2>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-gray-400 hover:text-[#FF6F61] dark:text-gray-500 dark:hover:text-[#FF6F61] transition-colors">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/${quiz.id}/edit`} className="flex items-center gap-3">
                              <Edit className="h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/play/${quiz.slug}`} target="_blank" className="flex items-center gap-3">
                              <ExternalLink className="h-4 w-4" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => copyLink(quiz.slug)} className="flex items-center gap-3">
                            <Copy className="h-4 w-4" />
                            Copy Link
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteQuiz(quiz.id)}
                            className="flex items-center gap-3 text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Description */}
                    <p className="mb-5 text-base text-gray-700 dark:text-gray-300 line-clamp-2">
                      {quiz.description || "No description"}
                    </p>
                  </div>

                  {/* Stats and Status */}
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <FileQuestion className="h-4 w-4" />
                        {quiz._count.questions} questions
                      </span>
                      <span className="h-1 w-1 rounded-full bg-gray-400 dark:bg-gray-600" />
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-4 w-4" />
                        {quiz._count.attempts} attempts
                      </span>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                          quiz.isPublic
                            ? "bg-green-500/20 text-green-700 dark:bg-green-500/30 dark:text-green-300"
                            : "bg-amber-500/20 text-amber-700 dark:bg-amber-500/30 dark:text-amber-300"
                        }`}
                      >
                        {quiz.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

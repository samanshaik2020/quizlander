"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  LogOut,
  Loader2,
  FileQuestion,
  BarChart3,
  CircleDot,
  Calendar,
  Globe,
  Lock,
  MousePointerClick,
  TrendingUp,
  Users,
  User,
  ChevronDown,
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

interface Analytics {
  totalClicks: number;
  totalAttempts: number;
  quizAnalytics: {
    id: string;
    title: string;
    clicks: number;
    attempts: number;
    conversionRate: number;
  }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      fetchQuizzes();
      fetchAnalytics();
    }
  }, [user, authLoading, router]);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("/api/quizzes");
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setQuizzes(data);
        }
      } else if (response.status === 401) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const response = await fetch("/api/analytics");
      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setAnalytics(data);
        }
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
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
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const quiz = await response.json();
          router.push(`/dashboard/${quiz.id}/edit`);
        }
      } else if (response.status === 401) {
        router.push("/login");
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <CircleDot className="h-7 w-7 text-slate-900" />
              <span className="text-xl font-bold text-slate-900">QuizLander</span>
            </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-900 truncate max-w-[150px]">
                    {user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs text-slate-500 truncate max-w-[150px]">
                    {user?.email}
                  </p>
                </div>
                <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg z-20 py-2">
                    <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-sm">
                          {user?.email?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {user?.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setProfileOpen(false);
                          handleSignOut();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-1">
              Manage your quizzes and track performance
            </p>
          </div>
          <button
            onClick={createQuiz}
            disabled={creating}
            className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            New Quiz
          </button>
        </div>

        {/* Analytics Section */}
        {analytics && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Analytics Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{analytics.totalAttempts}</p>
                    <p className="text-sm text-slate-500">Total Attempts</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <MousePointerClick className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{analytics.totalClicks}</p>
                    <p className="text-sm text-slate-500">Link Clicks</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">
                      {analytics.totalAttempts > 0
                        ? Math.round((analytics.totalClicks / analytics.totalAttempts) * 100)
                        : 0}%
                    </p>
                    <p className="text-sm text-slate-500">Click Rate</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Quizzes Section Header */}
        <h2 className="text-lg font-semibold text-slate-900 mb-4">My Quizzes</h2>

        {/* Quiz List */}
        {quizzes.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                <FileQuestion className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No quizzes yet</h3>
              <p className="text-slate-600 mb-6 max-w-sm">
                Create your first quiz and start sharing it with the world.
              </p>
              <button
                onClick={createQuiz}
                disabled={creating}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium px-5 py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {creating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Create Your First Quiz
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                {/* Quiz Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold text-slate-900 truncate">
                        {quiz.title}
                      </h2>
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          quiz.isPublic
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {quiz.isPublic ? (
                          <Globe className="h-3 w-3" />
                        ) : (
                          <Lock className="h-3 w-3" />
                        )}
                        {quiz.isPublic ? "Public" : "Private"}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm line-clamp-1">
                      {quiz.description || "No description"}
                    </p>
                  </div>
                </div>

                {/* Quiz Stats */}
                <div className="flex flex-wrap items-center gap-6 mb-5 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <FileQuestion className="h-4 w-4" />
                    <span>{quiz._count.questions} questions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>{quiz._count.attempts} attempts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Updated {formatDate(quiz.updatedAt)}</span>
                  </div>
                </div>

                {/* Quiz Performance */}
                {analytics?.quizAnalytics && (() => {
                  const quizAnalytic = analytics.quizAnalytics.find(a => a.id === quiz.id);
                  if (!quizAnalytic) return null;
                  return (
                    <div className="flex items-center gap-4 mb-5 p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <MousePointerClick className="h-4 w-4 text-green-600" />
                        <span className="text-sm"><span className="font-semibold text-green-600">{quizAnalytic.clicks}</span> clicks</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        <span className="text-sm"><span className="font-semibold text-purple-600">{quizAnalytic.conversionRate}%</span> conversion</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Quiz Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-100">
                  <Link
                    href={`/dashboard/${quiz.id}/edit`}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Quiz
                  </Link>
                  <Link
                    href={`/play/${quiz.slug}`}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Preview
                  </Link>
                  <button
                    onClick={() => copyLink(quiz.slug)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                    Copy Link
                  </button>
                  <button
                    onClick={() => deleteQuiz(quiz.id)}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 text-sm font-medium rounded-lg transition-colors ml-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

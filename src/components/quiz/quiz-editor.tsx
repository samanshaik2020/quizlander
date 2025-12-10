"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Save,
  Share2,
  Loader2,
  ArrowLeft,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestionEditor } from "./question-editor";
import { FinalPageEditor } from "./final-page-editor";
import { ShareDialog } from "./share-dialog";
import { toast } from "sonner";
import { nanoid } from "nanoid";
import Link from "next/link";
import type { FinalPage } from "@/types";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

interface Question {
  id: string;
  text: string;
  order: number;
  options: Option[];
}

interface Quiz {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  isPublic: boolean;
  questions: Question[];
  finalPage: FinalPage | null;
}

interface QuizEditorProps {
  quiz: Quiz;
}

export function QuizEditor({ quiz: initialQuiz }: QuizEditorProps) {
  const [quiz, setQuiz] = useState<Quiz>(initialQuiz);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const defaultFinalPage: FinalPage = {
    title: "Congratulations!",
    body: "You have completed the quiz.",
    buttonText: "Retake Quiz",
    buttonAction: "retake",
  };

  // Auto-save with debounce
  const saveQuiz = useCallback(async () => {
    if (!hasChanges) return;

    // Filter out incomplete questions (empty text or options with empty text)
    const validQuestions = quiz.questions.filter(
      (q) =>
        q.text.trim().length > 0 &&
        q.options.length >= 2 &&
        q.options.every((opt) => opt.text.trim().length > 0)
    );

    setIsSaving(true);
    try {
      const response = await fetch(`/api/quizzes/${quiz.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: quiz.title,
          description: quiz.description,
          isPublic: quiz.isPublic,
          finalPage: quiz.finalPage || defaultFinalPage,
          questions: validQuestions,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save quiz");
      }

      setHasChanges(false);
      toast.success("Quiz saved");
    } catch {
      toast.error("Failed to save quiz");
    } finally {
      setIsSaving(false);
    }
  }, [quiz, hasChanges, defaultFinalPage]);


  const updateQuiz = (updates: Partial<Quiz>) => {
    setQuiz((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: nanoid(),
      text: "",
      order: quiz.questions.length,
      options: [
        { id: nanoid(), text: "", isCorrect: true, order: 0 },
        { id: nanoid(), text: "", isCorrect: false, order: 1 },
      ],
    };
    updateQuiz({ questions: [...quiz.questions, newQuestion] });
  };

  const updateQuestion = (index: number, question: Question) => {
    const newQuestions = [...quiz.questions];
    newQuestions[index] = question;
    updateQuiz({ questions: newQuestions });
  };

  const deleteQuestion = (index: number) => {
    const newQuestions = quiz.questions
      .filter((_, i) => i !== index)
      .map((q, i) => ({ ...q, order: i }));
    updateQuiz({ questions: newQuestions });
  };

  const [activeTab, setActiveTab] = useState("questions");

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                asChild
              >
                <Link href="/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <Input
                  value={quiz.title}
                  onChange={(e) => updateQuiz({ title: e.target.value })}
                  className="w-64 bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-600 focus:ring-gray-500 focus:border-gray-500 rounded-md text-sm placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Quiz Title"
                />
                {isSaving && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Saving...
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                asChild
              >
                <Link href={`/play/${quiz.slug}`} target="_blank">
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                onClick={() => saveQuiz()}
                disabled={isSaving || !hasChanges}
              >
                <Save className="h-4 w-4" />
                <span>Save</span>
              </Button>
              <Button
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-md hover:bg-gray-800 dark:hover:bg-gray-100"
                onClick={() => setShareOpen(true)}
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("questions")}
                  className={cn(
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                    activeTab === "questions"
                      ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  Questions
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={cn(
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                    activeTab === "settings"
                      ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  Settings
                </button>
                <button
                  onClick={() => setActiveTab("completion")}
                  className={cn(
                    "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm",
                    activeTab === "completion"
                      ? "border-gray-900 dark:border-white text-gray-900 dark:text-white"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600"
                  )}
                >
                  Completion Page
                </button>
              </nav>
            </div>

            {/* Questions Tab */}
            {activeTab === "questions" && (
              <div className="max-w-4xl mx-auto mt-8 space-y-6">
                {quiz.questions.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12">
                    <div className="flex flex-col items-center justify-center text-center">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No questions yet. Add your first question to get started.
                      </p>
                      <Button
                        onClick={addQuestion}
                        className="flex items-center space-x-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add Question</span>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      {quiz.questions.map((question, index) => (
                        <QuestionEditor
                          key={question.id}
                          question={question}
                          questionNumber={index + 1}
                          onUpdate={(q) => updateQuestion(index, q)}
                          onDelete={() => deleteQuestion(index)}
                          canDelete={quiz.questions.length > 1}
                        />
                      ))}
                    </div>
                    <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600 pt-6">
                      <button
                        onClick={addQuestion}
                        className="w-full flex justify-center items-center space-x-2 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <Plus className="h-5 w-5" />
                        <span>Add Question</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="max-w-4xl mx-auto mt-8 space-y-6">
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quiz Settings</h2>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">Title</Label>
                      <Input
                        id="title"
                        value={quiz.title}
                        onChange={(e) => updateQuiz({ title: e.target.value })}
                        placeholder="Enter quiz title"
                        className="bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md focus:ring-gray-500 focus:border-gray-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</Label>
                      <Textarea
                        id="description"
                        value={quiz.description || ""}
                        onChange={(e) => updateQuiz({ description: e.target.value })}
                        placeholder="Enter quiz description (optional)"
                        className="min-h-[100px] bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-md focus:ring-gray-500 focus:border-gray-500"
                      />
                    </div>
                    <Separator className="bg-gray-200 dark:bg-gray-700" />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Public Quiz</Label>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Allow anyone with the link to take this quiz
                        </p>
                      </div>
                      <Switch
                        checked={quiz.isPublic}
                        onCheckedChange={(checked: boolean) =>
                          updateQuiz({ isPublic: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Completion Tab - Full Width */}
            {activeTab === "completion" && (
              <div className="mt-6">
                <FinalPageEditor
                  finalPage={quiz.finalPage || defaultFinalPage}
                  onUpdate={(finalPage) => updateQuiz({ finalPage })}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer with logo */}
      <footer className="fixed bottom-4 left-4">
        <div className="w-10 h-10 bg-gray-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-gray-900 font-bold text-lg">
          Q
        </div>
      </footer>

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        slug={quiz.slug}
        title={quiz.title}
      />
    </div>
  );
}

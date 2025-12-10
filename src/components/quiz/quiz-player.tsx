"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Trophy, RotateCcw, ExternalLink, CheckCircle2, Circle, Loader2 } from "lucide-react";
import type { FinalPage, FinalPageStyles } from "@/types";
import { cn } from "@/lib/utils";

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

interface QuizData {
  id: string;
  title: string;
  description: string | null;
  questions: Question[];
  finalPage: FinalPage | null;
}

interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  finalPage: FinalPage | null;
}

const defaultStyles: FinalPageStyles = {
  backgroundColor: "#f8fafc",
  backgroundImage: "",
  backgroundOverlay: "rgba(0,0,0,0)",
  cardBackgroundColor: "#ffffff",
  cardBorderRadius: "12",
  cardShadow: "lg",
  titleFontSize: "24",
  titleColor: "#1f2937",
  titleFontWeight: "700",
  bodyFontSize: "14",
  bodyColor: "#6b7280",
  scoreFontSize: "48",
  scoreColor: "#3b82f6",
  iconColor: "#3b82f6",
  iconBackgroundColor: "#eff6ff",
  showIcon: true,
  buttonBackgroundColor: "#1f2937",
  buttonTextColor: "#ffffff",
  buttonBorderRadius: "8",
  buttonFontSize: "14",
};

const shadowClasses: Record<string, string> = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
  lg: "shadow-lg",
  xl: "shadow-xl",
  "2xl": "shadow-2xl",
};

interface QuizPlayerProps {
  quiz: QuizData;
  slug: string;
}

export function QuizPlayer({ quiz, slug }: QuizPlayerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isLastQuestion = currentQuestion === quiz.questions.length - 1;
  const hasAnswer = answers[question?.id];

  const handleAnswer = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [question.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/play/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setResult(null);
  };

  const handleLinkClick = async (buttonUrl: string) => {
    // Track the click
    try {
      await fetch("/api/analytics/click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          buttonUrl,
        }),
      });
    } catch (error) {
      console.error("Error tracking click:", error);
    }
    // Open the link
    window.open(buttonUrl, "_blank", "noopener,noreferrer");
  };

  // Show result page - Full page completion view
  if (result) {
    const finalPage = result.finalPage || {
      title: "Congratulations!",
      body: "You have completed the quiz.",
      buttonText: "Retake Quiz",
      buttonAction: "retake" as const,
    };

    const styles = { ...defaultStyles, ...finalPage.styles };
    const percentage = result.percentage;
    const isExcellent = percentage >= 80;
    const isGood = percentage >= 60 && percentage < 80;

    return (
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          backgroundColor: styles.backgroundColor,
          backgroundImage: styles.backgroundImage
            ? `url(${styles.backgroundImage})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Background Overlay */}
        {styles.backgroundImage && styles.backgroundOverlay && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: styles.backgroundOverlay }}
          />
        )}

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl" />
        </div>

        {/* Full Page Content */}
        <div className="relative min-h-screen flex flex-col">
          {/* Header */}
          <header className="py-6 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p
                className="text-sm font-medium uppercase tracking-wider opacity-70"
                style={{ color: styles.bodyColor }}
              >
                Quiz Completed
              </p>
              <h2
                className="text-lg font-semibold mt-1 opacity-80"
                style={{ color: styles.titleColor }}
              >
                {quiz.title}
              </h2>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
            <div className="w-full max-w-2xl text-center">
              {/* Icon */}
              {styles.showIcon !== false && (
                <div className="flex justify-center mb-8">
                  <div
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full flex items-center justify-center shadow-2xl"
                    style={{ 
                      backgroundColor: styles.iconBackgroundColor,
                      boxShadow: `0 25px 50px -12px ${styles.iconColor}40`
                    }}
                  >
                    <Trophy
                      className="h-12 w-12 sm:h-16 sm:w-16"
                      style={{ color: styles.iconColor }}
                    />
                  </div>
                </div>
              )}

              {/* Title */}
              <h1
                className="mb-8"
                style={{
                  fontSize: `clamp(28px, 5vw, ${parseInt(styles.titleFontSize || "24") + 16}px)`,
                  fontWeight: styles.titleFontWeight,
                  color: styles.titleColor,
                }}
              >
                {finalPage.title}
              </h1>

              {/* Score Display */}
              <div className="mb-8">
                {/* Large Percentage */}
                <div
                  className="font-bold mb-4"
                  style={{
                    fontSize: `clamp(64px, 15vw, ${parseInt(styles.scoreFontSize || "48") + 32}px)`,
                    color: styles.scoreColor,
                    lineHeight: 1,
                  }}
                >
                  {result.percentage}%
                </div>

                {/* Score Details */}
                <p
                  className="text-lg sm:text-xl mb-2"
                  style={{
                    fontSize: `${parseInt(styles.bodyFontSize || "14") + 4}px`,
                    color: styles.bodyColor,
                  }}
                >
                  You scored <strong>{result.score}</strong> out of <strong>{result.total}</strong> questions
                </p>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto mt-6">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${result.percentage}%`,
                        backgroundColor: isExcellent ? "#22c55e" : isGood ? "#3b82f6" : "#f59e0b",
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs opacity-60" style={{ color: styles.bodyColor }}>
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Body Message */}
              <p
                className="mb-10 max-w-lg mx-auto"
                style={{
                  fontSize: `${parseInt(styles.bodyFontSize || "14") + 2}px`,
                  color: styles.bodyColor,
                  lineHeight: 1.6,
                }}
              >
                {finalPage.body}
              </p>

              {/* Action Button */}
              <div className="flex justify-center">
                {finalPage.buttonAction === "retake" ? (
                  <button
                    onClick={handleRetake}
                    className="px-8 py-4 flex items-center justify-center gap-3 transition-all hover:opacity-90 hover:scale-105 shadow-lg"
                    style={{
                      backgroundColor: styles.buttonBackgroundColor,
                      color: styles.buttonTextColor,
                      borderRadius: `${styles.buttonBorderRadius}px`,
                      fontSize: `${parseInt(styles.buttonFontSize || "14") + 2}px`,
                      fontWeight: 600,
                    }}
                  >
                    <RotateCcw className="h-5 w-5" />
                    {finalPage.buttonText}
                  </button>
                ) : (
                  <button
                    onClick={() => handleLinkClick(finalPage.buttonUrl || "")}
                    className="px-8 py-4 flex items-center justify-center gap-3 transition-all hover:opacity-90 hover:scale-105 shadow-lg cursor-pointer"
                    style={{
                      backgroundColor: styles.buttonBackgroundColor,
                      color: styles.buttonTextColor,
                      borderRadius: `${styles.buttonBorderRadius}px`,
                      fontSize: `${parseInt(styles.buttonFontSize || "14") + 2}px`,
                      fontWeight: 600,
                    }}
                  >
                    <ExternalLink className="h-5 w-5" />
                    {finalPage.buttonText}
                  </button>
                )}
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="py-6 px-4 sm:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <p
                className="text-sm opacity-50"
                style={{ color: styles.bodyColor }}
              >
                Powered by Quizlander
              </p>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-white/20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate">
                  {quiz.title}
                </h1>
                {quiz.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                    {quiz.description}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1.5">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {currentQuestion + 1}/{quiz.questions.length}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Progress Bar */}
        <div className="bg-white/50 dark:bg-slate-900/50 border-b border-white/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={progress} className="h-2 bg-slate-200 dark:bg-slate-700" />
              </div>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 min-w-[4rem] text-right">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
        </div>

        {/* Question Indicators */}
        <div className="bg-white/30 dark:bg-slate-900/30 border-b border-white/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {quiz.questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = idx === currentQuestion;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestion(idx)}
                    className={cn(
                      "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-200",
                      isCurrent
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 scale-110"
                        : isAnswered
                        ? "bg-green-500 text-white"
                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600"
                    )}
                  >
                    {isAnswered && !isCurrent ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      idx + 1
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
          <Card className="w-full max-w-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 rounded-2xl overflow-hidden">
            {/* Question Number Badge */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{currentQuestion + 1}</span>
                </div>
                <div>
                  <p className="text-blue-100 text-xs uppercase tracking-wider font-medium">Question</p>
                  <p className="text-white text-sm font-medium">
                    {currentQuestion + 1} of {quiz.questions.length}
                  </p>
                </div>
              </div>
            </div>

            {/* Question Text */}
            <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-relaxed">
                {question.text}
              </h2>
            </div>

            {/* Options */}
            <CardContent className="p-6">
              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={handleAnswer}
                className="space-y-3"
              >
                {question.options
                  .sort((a, b) => a.order - b.order)
                  .map((option, idx) => {
                    const isSelected = answers[question.id] === option.id;
                    const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D...
                    return (
                      <div
                        key={option.id}
                        onClick={() => handleAnswer(option.id)}
                        className={cn(
                          "group relative flex items-center gap-4 rounded-xl border-2 p-4 cursor-pointer transition-all duration-200",
                          isSelected
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50 shadow-md shadow-blue-500/10"
                            : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        )}
                      >
                        {/* Option Letter Badge */}
                        <div
                          className={cn(
                            "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-200",
                            isSelected
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 dark:group-hover:bg-blue-900/50 dark:group-hover:text-blue-400"
                          )}
                        >
                          {optionLetter}
                        </div>

                        {/* Hidden Radio for accessibility */}
                        <RadioGroupItem
                          value={option.id}
                          id={option.id}
                          className="sr-only"
                        />

                        {/* Option Text */}
                        <Label
                          htmlFor={option.id}
                          className={cn(
                            "flex-1 cursor-pointer text-base transition-colors duration-200",
                            isSelected
                              ? "text-blue-900 dark:text-blue-100 font-medium"
                              : "text-slate-700 dark:text-slate-300"
                          )}
                        >
                          {option.text}
                        </Label>

                        {/* Selection Indicator */}
                        <div
                          className={cn(
                            "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                            isSelected
                              ? "border-blue-600 bg-blue-600"
                              : "border-slate-300 dark:border-slate-600 group-hover:border-blue-400"
                          )}
                        >
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    );
                  })}
              </RadioGroup>
            </CardContent>
          </Card>
        </main>

        {/* Navigation Footer */}
        <footer className="sticky bottom-0 border-t border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="gap-2 px-4 sm:px-6 h-11 rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>

              {/* Center - Question dots for mobile */}
              <div className="flex items-center gap-1.5 sm:hidden">
                {quiz.questions.slice(
                  Math.max(0, currentQuestion - 2),
                  Math.min(quiz.questions.length, currentQuestion + 3)
                ).map((q, idx) => {
                  const actualIdx = Math.max(0, currentQuestion - 2) + idx;
                  const isAnswered = !!answers[q.id];
                  const isCurrent = actualIdx === currentQuestion;
                  return (
                    <div
                      key={q.id}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        isCurrent
                          ? "w-6 bg-blue-600"
                          : isAnswered
                          ? "bg-green-500"
                          : "bg-slate-300 dark:bg-slate-600"
                      )}
                    />
                  );
                })}
              </div>

              {isLastQuestion ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!hasAnswer || isSubmitting}
                  className="gap-2 px-6 sm:px-8 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/25 disabled:opacity-40 disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="hidden sm:inline">Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit</span>
                      <CheckCircle2 className="h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  disabled={!hasAnswer}
                  className="gap-2 px-6 sm:px-8 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/25 disabled:opacity-40 disabled:shadow-none"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

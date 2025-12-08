"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Trophy, RotateCcw, ExternalLink } from "lucide-react";

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

interface FinalPage {
  title: string;
  body: string;
  buttonText: string;
  buttonAction: "retake" | "url";
  buttonUrl?: string;
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

  // Show result page
  if (result) {
    const finalPage = result.finalPage || {
      title: "Congratulations!",
      body: "You have completed the quiz.",
      buttonText: "Retake Quiz",
      buttonAction: "retake" as const,
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">{finalPage.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary mb-2">
                {result.percentage}%
              </div>
              <p className="text-muted-foreground">
                You scored {result.score} out of {result.total}
              </p>
            </div>
            <p className="text-center text-muted-foreground">{finalPage.body}</p>
            {finalPage.buttonAction === "retake" ? (
              <Button onClick={handleRetake} className="w-full" size="lg">
                <RotateCcw className="h-4 w-4 mr-2" />
                {finalPage.buttonText}
              </Button>
            ) : (
              <Button asChild className="w-full" size="lg">
                <a
                  href={finalPage.buttonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {finalPage.buttonText}
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur-sm">
        <div className="container py-4">
          <h1 className="text-xl font-semibold">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-sm text-muted-foreground mt-1">
              {quiz.description}
            </p>
          )}
        </div>
      </header>

      {/* Progress */}
      <div className="container py-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <main className="flex-1 container py-6">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {question.text}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[question.id] || ""}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {question.options
                .sort((a, b) => a.order - b.order)
                .map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => handleAnswer(option.id)}
                  >
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label
                      htmlFor={option.id}
                      className="flex-1 cursor-pointer font-normal"
                    >
                      {option.text}
                    </Label>
                  </div>
                ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </main>

      {/* Navigation */}
      <footer className="border-t bg-background/80 backdrop-blur-sm">
        <div className="container py-4 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          {isLastQuestion ? (
            <Button
              onClick={handleSubmit}
              disabled={!hasAnswer || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!hasAnswer}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
}

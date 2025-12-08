import { z } from "zod";

export const optionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean().default(false),
  order: z.number().int().min(0),
});

export const questionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "Question text is required"),
  order: z.number().int().min(0),
  options: z.array(optionSchema).min(2, "At least 2 options required"),
});

export const finalPageSchema = z.object({
  title: z.string().default("Congratulations!"),
  body: z.string().default("You have completed the quiz."),
  buttonText: z.string().default("Retake Quiz"),
  buttonAction: z.enum(["retake", "url"]).default("retake"),
  buttonUrl: z.string().url().optional(),
});

export const createQuizSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean().default(true),
});

export const updateQuizSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(1000).optional(),
  isPublic: z.boolean().optional(),
  finalPage: finalPageSchema.optional(),
  questions: z.array(questionSchema).optional(),
});

export const submitAnswersSchema = z.object({
  answers: z.record(z.string(), z.string()), // { questionId: optionId }
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type UpdateQuizInput = z.infer<typeof updateQuizSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
export type OptionInput = z.infer<typeof optionSchema>;
export type FinalPageInput = z.infer<typeof finalPageSchema>;
export type SubmitAnswersInput = z.infer<typeof submitAnswersSchema>;

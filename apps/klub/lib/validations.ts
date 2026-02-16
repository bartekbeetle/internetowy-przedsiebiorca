import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3, "Tytul musi miec min. 3 znaki").max(200, "Tytul max 200 znakow"),
  content: z.string().min(10, "Tresc musi miec min. 10 znakow").max(10000, "Tresc max 10000 znakow"),
  type: z.enum(["DISCUSSION", "WIN", "QUESTION", "RESOURCE", "PROGRESS_UPDATE"]),
  subCategoryId: z.string().min(1, "Kategoria jest wymagana"),
  tagIds: z.array(z.string()).max(5, "Max 5 tagow").optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const updatePostSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  content: z.string().min(10).max(10000).optional(),
  type: z.enum(["DISCUSSION", "WIN", "QUESTION", "RESOURCE", "PROGRESS_UPDATE"]).optional(),
  subCategoryId: z.string().min(1).optional(),
  tagIds: z.array(z.string()).max(5).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, "Komentarz nie moze byc pusty").max(2000, "Komentarz max 2000 znakow"),
  parentId: z.string().optional(),
});

// ==========================================
// COURSES
// ==========================================

export const difficultyValues = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;
export const lessonTypeValues = ["VIDEO", "TEXT", "MIXED", "QUIZ"] as const;

export const createCourseSchema = z.object({
  title: z.string().min(3, "Tytul min. 3 znaki").max(200),
  description: z.string().min(10, "Opis min. 10 znakow").max(5000),
  difficulty: z.enum(difficultyValues).optional(),
  isPremium: z.boolean().optional(),
});

export const createLessonSchema = z.object({
  title: z.string().min(3, "Tytul min. 3 znaki").max(200),
  content: z.string().min(1).max(50000),
  videoUrl: z.string().url().optional().or(z.literal("")),
  type: z.enum(lessonTypeValues).optional(),
  duration: z.number().min(0).max(600).optional(),
  order: z.number().min(0).optional(),
});

export const updateLessonSchema = createLessonSchema.partial();

export const createLessonNoteSchema = z.object({
  content: z.string().min(1, "Notatka nie moze byc pusta").max(5000),
});

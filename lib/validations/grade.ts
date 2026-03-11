import { z } from "zod";

export const gradeEntrySchema = z.object({
  studentId: z.number(),
  courseId: z.number(),
  score: z.coerce
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score cannot exceed 100"),
  grade: z
    .string()
    .min(1, "Grade letter is required")
    .max(2, "Grade letter too long"),
  semester: z.string().min(2, "Semester is required"),
  existingGradeId: z.number().optional(), // If present, implies an update instead of a create
});

export const bulkGradeSchema = z.object({
  courseId: z.coerce.number().min(1, "Select a course to grade"),
  grades: z.array(gradeEntrySchema),
});

export type GradeEntrySchemaType = z.infer<typeof gradeEntrySchema>;
export type BulkGradeSchemaType = z.infer<typeof bulkGradeSchema>;

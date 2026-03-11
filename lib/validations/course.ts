import { z } from "zod";

export const courseSchema = z.object({
  code: z.string().min(2, "Course code is required"),
  name: z.string().min(2, "Course name must be at least 2 characters"),
  department: z.string().min(1, "Department is required"),
  credits: z.coerce.number().min(1, "Credits must be at least 1").max(6, "Credits cannot exceed 6"),
  facultyId: z.coerce.number().min(1, "Faculty must be assigned"),
  maxEnrollment: z.coerce.number().min(1, "Max enrollment must be at least 1"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

export type CourseSchemaType = z.infer<typeof courseSchema>;

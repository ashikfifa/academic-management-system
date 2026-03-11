import { z } from "zod";

export const studentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  year: z.coerce.number().min(1, "Year must be between 1-4").max(4, "Year must be between 1-4"),
  department: z.string().min(1, "Department is required"),
  gpa: z.coerce.number().min(0, "GPA must be between 0-4").max(4, "GPA must be between 0-4"),
  enrolledCourses: z.array(z.coerce.number()).default([]),
  avatar: z.string().default(""),
});

export type StudentSchemaType = z.infer<typeof studentSchema>;

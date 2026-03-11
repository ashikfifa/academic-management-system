import { z } from "zod";

export const facultySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(1, "Department is required"),
  title: z.string().min(1, "Title is required"),
  courseIds: z.array(z.coerce.number()).default([]),
});

export type FacultySchemaType = z.infer<typeof facultySchema>;

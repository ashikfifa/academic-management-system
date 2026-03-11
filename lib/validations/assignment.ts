import { z } from "zod";

export const assignmentSchema = z.object({
  courseId: z.coerce.number().min(1, "Select a course to assign students to"),
  studentIds: z
    .array(
      z.object({
        value: z.coerce.number().min(1, "Select a student"),
      })
    )
    .min(1, "You must assign at least one student")
    .refine(
      (items) => {
        // Ensure no duplicate students are selected
        const ids = items.map((item) => item.value).filter((val) => val > 0);
        const uniqueIds = new Set(ids);
        return ids.length === uniqueIds.size;
      },
      {
        message: "Duplicate students are not allowed",
      }
    ),
});

export type AssignmentSchemaType = z.infer<typeof assignmentSchema>;

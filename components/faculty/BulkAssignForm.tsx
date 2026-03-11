"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { assignmentSchema, AssignmentSchemaType } from "@/lib/validations/assignment";
import { Course, Student } from "@/types";
import { getCourses } from "@/lib/api/courses";
import { getStudents, updateStudent } from "@/lib/api/students";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Plus, Minus, Save, Loader2, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function BulkAssignForm() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<AssignmentSchemaType>({
    resolver: zodResolver(assignmentSchema) as any,
    defaultValues: {
      courseId: 0,
      studentIds: [{ value: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "studentIds",
  });

  useEffect(() => {
    Promise.all([getCourses(), getStudents()]).then(([c, s]) => {
      setCourses(c);
      setStudents(s);
    }).catch(console.error);
  }, []);

  const handleFormSubmit = async (data: AssignmentSchemaType) => {
    setSubmitting(true);
    setSuccess(false);

    try {
      const courseId = data.courseId;
      const selectedStudentIds = data.studentIds.map((item) => item.value);

      // Filter to only the selected students
      const targetStudents = students.filter((s) => selectedStudentIds.includes(s.id));

      // Update sequentially or via Promise.all
      // Optimally, backend would support a bulk endpoint, but JSON Server requires individual PUT/PATCH requests
      const promises = targetStudents.map((student) => {
        // Only add if not already enrolled
        if (!student.enrolledCourses.includes(courseId)) {
          return updateStudent(student.id, {
            enrolledCourses: [...student.enrolledCourses, courseId],
          });
        }
        return Promise.resolve(); // Already enrolled, do nothing
      });

      await Promise.all(promises);
      
      setSuccess(true);
      reset(); // Reset form
      setTimeout(() => setSuccess(false), 5000); // Hide success message after 5s

    } catch (error) {
      console.error("Failed to assign students:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Target Course</CardTitle>
          <CardDescription>Select the course you want to assign students to.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="courseId">Course *</Label>
            <Select
              value={watch("courseId") > 0 ? watch("courseId").toString() : ""}
              onValueChange={(val) => setValue("courseId", Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course..." />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.code} - {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.courseId && (
              <p className="text-sm text-destructive">{errors.courseId.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Assign Students</CardTitle>
            <CardDescription>Add multiple students to this course.</CardDescription>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => append({ value: 0 })}
          >
            <Plus className="w-4 h-4" />
            Add Row
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-3">
              <div className="flex-1">
                <Select
                  value={watch(`studentIds.${index}.value`) > 0 ? watch(`studentIds.${index}.value`).toString() : ""}
                  onValueChange={(val) => setValue(`studentIds.${index}.value`, Number(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        {student.name} ({student.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.studentIds?.[index]?.value && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.studentIds[index]?.value?.message}
                  </p>
                )}
              </div>
              
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 text-destructive hover:text-destructive shrink-0"
                onClick={() => remove(index)}
                disabled={fields.length === 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {errors.studentIds?.root && (
            <p className="text-sm text-destructive font-medium pt-2">
              {errors.studentIds.root.message}
            </p>
          )}

          {success && (
            <Alert className="bg-emerald-50 text-emerald-900 border-emerald-200 mt-4">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <AlertDescription>
                Successfully assigned students to the course!
              </AlertDescription>
            </Alert>
          )}

        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting} className="gap-2 min-w-[180px]">
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Confirm Enrollments
        </Button>
      </div>
    </form>
  );
}

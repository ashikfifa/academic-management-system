"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema, StudentSchemaType } from "@/lib/validations/student";
import { Course } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Minus, Save, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getCourses } from "@/lib/api/courses";

interface StudentFormProps {
  defaultValues?: Partial<StudentSchemaType>;
  onSubmit: (data: StudentSchemaType) => Promise<void>;
  isEdit?: boolean;
}

const departments = [
  "Computer Science",
  "Mathematics",
  "Physics",
  "Engineering",
  "Chemistry",
  "Biology",
];

export default function StudentForm({ defaultValues, onSubmit, isEdit = false }: StudentFormProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StudentSchemaType>({
    resolver: zodResolver(studentSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      year: 1,
      department: "",
      gpa: 0,
      enrolledCourses: [],
      avatar: "",
      ...defaultValues,
    },
  });

  const enrolledCourses = watch("enrolledCourses") || [];

  useEffect(() => {
    getCourses().then(setCourses).catch(console.error);
  }, []);

  const addCourse = () => {
    // Add a placeholder 0 that user will change via select
    setValue("enrolledCourses", [...enrolledCourses, 0]);
  };

  const removeCourse = (index: number) => {
    const updated = enrolledCourses.filter((_, i) => i !== index);
    setValue("enrolledCourses", updated);
  };

  const updateCourse = (index: number, value: string) => {
    const updated = [...enrolledCourses];
    updated[index] = Number(value);
    setValue("enrolledCourses", updated);
  };

  const handleFormSubmit = async (data: StudentSchemaType) => {
    setSubmitting(true);
    try {
      // Filter out any 0 values from enrolled courses
      data.enrolledCourses = data.enrolledCourses.filter((c) => c > 0);
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl">
      {/* Basic Information */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="Enter full name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="student@university.edu" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input id="year" type="number" min={1} max={4} {...register("year")} />
              {errors.year && (
                <p className="text-sm text-destructive">{errors.year.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={watch("department")}
                onValueChange={(val) => setValue("department", val as string)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.department && (
                <p className="text-sm text-destructive">{errors.department.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="gpa">GPA</Label>
              <Input id="gpa" type="number" step="0.01" min={0} max={4} {...register("gpa")} />
              {errors.gpa && (
                <p className="text-sm text-destructive">{errors.gpa.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrolled Courses (Dynamic Fields) */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Enrolled Courses</CardTitle>
          <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addCourse}>
            <Plus className="w-4 h-4" />
            Add Course
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {enrolledCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No courses added. Click &quot;+ Add Course&quot; to enroll in courses.
            </p>
          ) : (
            enrolledCourses.map((courseId, index) => (
              <div key={index} className="flex items-center gap-3">
                <Select
                  value={courseId > 0 ? courseId.toString() : ""}
                  onValueChange={(val) => updateCourse(index, val as string)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.code} - {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-destructive hover:text-destructive shrink-0"
                  onClick={() => removeCourse(index)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={submitting} className="gap-2 min-w-[140px]">
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isEdit ? "Update Student" : "Create Student"}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSchema, CourseSchemaType } from "@/lib/validations/course";
import { Faculty } from "@/types";
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
import { Save, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getFaculty } from "@/lib/api/faculty";

interface CourseFormProps {
  defaultValues?: Partial<CourseSchemaType>;
  onSubmit: (data: CourseSchemaType) => Promise<void>;
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

export default function CourseForm({ defaultValues, onSubmit, isEdit = false }: CourseFormProps) {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema) as any,
    defaultValues: {
      code: "",
      name: "",
      department: "",
      credits: 3,
      facultyId: 0,
      maxEnrollment: 30,
      description: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    getFaculty().then(setFacultyList).catch(console.error);
  }, []);

  const handleFormSubmit = async (data: CourseSchemaType) => {
    setSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl">
      {/* Course Information */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Course Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code *</Label>
              <Input id="code" placeholder="e.g. CS101" {...register("code")} />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input id="name" placeholder="e.g. Introduction to Programming" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <Label htmlFor="credits">Credits *</Label>
              <Input id="credits" type="number" min={1} max={6} {...register("credits")} />
              {errors.credits && (
                <p className="text-sm text-destructive">{errors.credits.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxEnrollment">Max Enrollment *</Label>
              <Input id="maxEnrollment" type="number" min={1} {...register("maxEnrollment")} />
              {errors.maxEnrollment && (
                <p className="text-sm text-destructive">{errors.maxEnrollment.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facultyId">Assigned Faculty *</Label>
            <Select
              value={watch("facultyId")?.toString() || ""}
              onValueChange={(val) => setValue("facultyId", Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select faculty member" />
              </SelectTrigger>
              <SelectContent>
                {facultyList.map((f) => (
                  <SelectItem key={f.id} value={f.id.toString()}>
                    {f.name} — {f.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.facultyId && (
              <p className="text-sm text-destructive">{errors.facultyId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the course..."
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
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
          {isEdit ? "Update Course" : "Create Course"}
        </Button>
      </div>
    </form>
  );
}

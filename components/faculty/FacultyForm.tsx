"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { facultySchema, FacultySchemaType } from "@/lib/validations/faculty";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";
import { useState } from "react";

interface FacultyFormProps {
  defaultValues?: Partial<FacultySchemaType>;
  onSubmit: (data: FacultySchemaType) => Promise<void>;
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

const titles = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "Visiting Professor",
];

export default function FacultyForm({ defaultValues, onSubmit, isEdit = false }: FacultyFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FacultySchemaType>({
    resolver: zodResolver(facultySchema) as any,
    defaultValues: {
      name: "",
      email: "",
      department: "",
      title: "",
      courseIds: [],
      ...defaultValues,
    },
  });

  const handleFormSubmit = async (data: FacultySchemaType) => {
    setSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-2xl">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Faculty Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" placeholder="e.g. Dr. Sarah Williams" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" placeholder="faculty@university.edu" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <Label htmlFor="title">Title *</Label>
              <Select
                value={watch("title")}
                onValueChange={(val) => setValue("title", val as string)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select title" />
                </SelectTrigger>
                <SelectContent>
                  {titles.map((title) => (
                    <SelectItem key={title} value={title}>
                      {title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting} className="gap-2 min-w-[140px]">
          {submitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isEdit ? "Update Faculty" : "Add Faculty"}
        </Button>
      </div>
    </form>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CourseForm from "@/components/courses/CourseForm";
import { getCourseById, updateCourse } from "@/lib/api/courses";
import { CourseSchemaType } from "@/lib/validations/course";
import { Course } from "@/types";

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = Number(params.id);

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourseById(courseId)
      .then(setCourse)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleSubmit = async (data: CourseSchemaType) => {
    await updateCourse(courseId, data);
    router.push("/courses");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Course not found.</p>
        <Link href="/courses">
          <Button variant="outline">Back to Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/courses">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <h2 className="text-xl font-semibold">Edit Course</h2>
      </div>
      <CourseForm
        defaultValues={{
          code: course.code,
          name: course.name,
          department: course.department,
          credits: course.credits,
          facultyId: course.facultyId,
          maxEnrollment: course.maxEnrollment,
          description: course.description,
        }}
        onSubmit={handleSubmit}
        isEdit
      />
    </div>
  );
}

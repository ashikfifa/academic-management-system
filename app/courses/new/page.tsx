"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CourseForm from "@/components/courses/CourseForm";
import { createCourse } from "@/lib/api/courses";
import { CourseSchemaType } from "@/lib/validations/course";

export default function NewCoursePage() {
  const router = useRouter();

  const handleSubmit = async (data: CourseSchemaType) => {
    await createCourse(data);
    router.push("/courses");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/courses">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <h2 className="text-xl font-semibold">Add New Course</h2>
      </div>
      <CourseForm onSubmit={handleSubmit} />
    </div>
  );
}

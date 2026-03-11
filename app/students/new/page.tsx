"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import StudentForm from "@/components/students/StudentForm";
import { createStudent } from "@/lib/api/students";
import { StudentSchemaType } from "@/lib/validations/student";

export default function NewStudentPage() {
  const router = useRouter();

  const handleSubmit = async (data: StudentSchemaType) => {
    await createStudent(data);
    router.push("/students");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/students">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <h2 className="text-xl font-semibold">Add New Student</h2>
      </div>
      <StudentForm onSubmit={handleSubmit} />
    </div>
  );
}

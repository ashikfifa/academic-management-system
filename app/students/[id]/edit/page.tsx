"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import StudentForm from "@/components/students/StudentForm";
import { getStudentById, updateStudent } from "@/lib/api/students";
import { StudentSchemaType } from "@/lib/validations/student";
import { Student } from "@/types";

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = Number(params.id);

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStudentById(studentId)
      .then(setStudent)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [studentId]);

  const handleSubmit = async (data: StudentSchemaType) => {
    await updateStudent(studentId, data);
    router.push(`/students/${studentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Student not found.</p>
        <Link href="/students">
          <Button variant="outline">Back to Students</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/students/${studentId}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <h2 className="text-xl font-semibold">Edit Student</h2>
      </div>
      <StudentForm
        defaultValues={{
          name: student.name,
          email: student.email,
          year: student.year,
          department: student.department,
          gpa: student.gpa,
          enrolledCourses: student.enrolledCourses,
          avatar: student.avatar,
        }}
        onSubmit={handleSubmit}
        isEdit
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import FacultyForm from "@/components/faculty/FacultyForm";
import { getFacultyById, updateFaculty } from "@/lib/api/faculty";
import { FacultySchemaType } from "@/lib/validations/faculty";
import { Faculty } from "@/types";

export default function EditFacultyPage() {
  const params = useParams();
  const router = useRouter();
  const facultyId = Number(params.id);

  const [faculty, setFaculty] = useState<Faculty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacultyById(facultyId)
      .then(setFaculty)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [facultyId]);

  const handleSubmit = async (data: FacultySchemaType) => {
    await updateFaculty(facultyId, data);
    router.push("/faculty");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!faculty) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-muted-foreground">Faculty member not found.</p>
        <Link href="/faculty">
          <Button variant="outline">Back to Faculty</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/faculty">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <h2 className="text-xl font-semibold">Edit Faculty</h2>
      </div>
      <FacultyForm
        defaultValues={{
          name: faculty.name,
          email: faculty.email,
          department: faculty.department,
          title: faculty.title,
          courseIds: faculty.courseIds,
        }}
        onSubmit={handleSubmit}
        isEdit
      />
    </div>
  );
}

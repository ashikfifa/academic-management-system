"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import FacultyForm from "@/components/faculty/FacultyForm";
import { createFaculty } from "@/lib/api/faculty";
import { FacultySchemaType } from "@/lib/validations/faculty";

export default function NewFacultyPage() {
  const router = useRouter();

  const handleSubmit = async (data: FacultySchemaType) => {
    await createFaculty(data);
    router.push("/faculty");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/faculty">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <h2 className="text-xl font-semibold">Add New Faculty</h2>
      </div>
      <FacultyForm onSubmit={handleSubmit} />
    </div>
  );
}

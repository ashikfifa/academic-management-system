"use client";

import BulkGradeForm from "@/components/faculty/BulkGradeForm";

export default function GradesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Grade Management</h2>
        <p className="text-sm text-muted-foreground mt-1 text-balance">
          Select a course below to view currently enrolled students, and assign or update their grades all from a single panel.
        </p>
      </div>
      
      <BulkGradeForm />
    </div>
  );
}

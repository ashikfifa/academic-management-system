"use client";

import BulkAssignForm from "@/components/faculty/BulkAssignForm";

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Course Assignments</h2>
        <p className="text-sm text-muted-foreground mt-1 text-balance">
          Select a course and assign multiple students to it at once. 
          Students already enrolled in the course will not be re-added.
        </p>
      </div>
      
      <BulkAssignForm />
    </div>
  );
}

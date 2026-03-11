"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Student, Course } from "@/types";
import { getStudents, deleteStudent } from "@/lib/api/students";
import { getCourses } from "@/lib/api/courses";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Search, Eye, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 8;

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [s, c] = await Promise.all([getStudents(), getCourses()]);
        setStudents(s);
        setCourses(c);
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const departments = useMemo(
    () => [...new Set(students.map((s) => s.department))],
    [students]
  );

  const filtered = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase());
      const matchesYear =
        yearFilter === "all" || student.year.toString() === yearFilter;
      const matchesDept =
        deptFilter === "all" || student.department === deptFilter;
      return matchesSearch && matchesYear && matchesDept;
    });
  }, [students, search, yearFilter, deptFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedStudents = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, yearFilter, deptFilter]);

  const handleDelete = async () => {
    if (!studentToDelete) return;
    // Optimistic UI update
    const prev = students;
    setStudents((s) => s.filter((st) => st.id !== studentToDelete.id));
    setDeleteDialogOpen(false);
    try {
      await deleteStudent(studentToDelete.id);
    } catch {
      setStudents(prev); // Rollback on error
    }
    setStudentToDelete(null);
  };

  const getCourseName = (courseId: number) => {
    return courses.find((c) => c.id === courseId)?.code || `Course #${courseId}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">All Students</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} students found</p>
        </div>
        <Link href="/students/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="1">Year 1</SelectItem>
            <SelectItem value="2">Year 2</SelectItem>
            <SelectItem value="3">Year 3</SelectItem>
            <SelectItem value="4">Year 4</SelectItem>
          </SelectContent>
        </Select>
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="text-center">Year</TableHead>
              <TableHead className="hidden sm:table-cell">Department</TableHead>
              <TableHead className="text-center">GPA</TableHead>
              <TableHead className="hidden lg:table-cell">Courses</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No students found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedStudents.map((student) => (
                <TableRow key={student.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-sm">
                    {student.email}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">Year {student.year}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm">{student.department}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={student.gpa >= 3.8 ? "default" : "secondary"}>
                      {student.gpa.toFixed(2)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {student.enrolledCourses.slice(0, 3).map((cid) => (
                        <Badge key={cid} variant="outline" className="text-xs">
                          {getCourseName(cid)}
                        </Badge>
                      ))}
                      {student.enrolledCourses.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{student.enrolledCourses.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/students/${student.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/students/${student.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          setStudentToDelete(student);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{studentToDelete?.name}&quot;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Faculty } from "@/types";
import { getFaculty, deleteFaculty } from "@/lib/api/faculty";
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
import { Plus, Search, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

const ITEMS_PER_PAGE = 8;

export default function FacultyPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [facultyToDelete, setFacultyToDelete] = useState<Faculty | null>(null);

  useEffect(() => {
    getFaculty()
      .then(setFacultyList)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const departments = useMemo(
    () => [...new Set(facultyList.map((f) => f.department))],
    [facultyList]
  );

  const filtered = useMemo(() => {
    return facultyList.filter((faculty) => {
      const matchesSearch =
        faculty.name.toLowerCase().includes(search.toLowerCase()) ||
        faculty.email.toLowerCase().includes(search.toLowerCase());
      const matchesDept =
        deptFilter === "all" || faculty.department === deptFilter;
      return matchesSearch && matchesDept;
    });
  }, [facultyList, search, deptFilter]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedFaculty = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, deptFilter]);

  const handleDelete = async () => {
    if (!facultyToDelete) return;
    const prev = facultyList;
    setFacultyList((f) => f.filter((item) => item.id !== facultyToDelete.id));
    setDeleteDialogOpen(false);
    try {
      await deleteFaculty(facultyToDelete.id);
    } catch {
      setFacultyList(prev);
    }
    setFacultyToDelete(null);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Faculty Members</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} faculty found</p>
        </div>
        <Link href="/faculty/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Faculty
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
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
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
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="hidden md:table-cell">Title</TableHead>
              <TableHead className="text-center">Assigned Courses</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedFaculty.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No faculty members found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedFaculty.map((faculty) => (
                <TableRow key={faculty.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{faculty.name}</TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {faculty.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{faculty.department}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    {faculty.title}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm font-medium">
                      {faculty.courseIds?.length || 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/faculty/${faculty.id}/edit`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => {
                          setFacultyToDelete(faculty);
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

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Faculty</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{facultyToDelete?.name}&quot;? This action
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

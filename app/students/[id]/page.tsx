"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Student, Course, Grade } from "@/types";
import { getStudentById } from "@/lib/api/students";
import { getCourses } from "@/lib/api/courses";
import { getGradesByStudentId } from "@/lib/api/grades";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeft, Pencil, Mail, Calendar, Building2, GraduationCap } from "lucide-react";

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = Number(params.id);

  const [student, setStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [s, c, g] = await Promise.all([
          getStudentById(studentId),
          getCourses(),
          getGradesByStudentId(studentId),
        ]);
        setStudent(s);
        setCourses(c);
        setGrades(g);
      } catch (error) {
        console.error("Failed to fetch student:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [studentId]);

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

  const enrolledCourseDetails = courses.filter((c) =>
    student.enrolledCourses.includes(c.id)
  );

  const avgScore = grades.length > 0
    ? (grades.reduce((sum, g) => sum + g.score, 0) / grades.length).toFixed(1)
    : "N/A";

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back + Actions */}
      <div className="flex items-center justify-between">
        <Link href="/students">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Students
          </Button>
        </Link>
        <Link href={`/students/${student.id}/edit`}>
          <Button size="sm" className="gap-2">
            <Pencil className="w-4 h-4" />
            Edit
          </Button>
        </Link>
      </div>

      {/* Profile Header */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            {/* Avatar */}
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-2xl font-bold shrink-0">
              {student.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <div className="flex flex-wrap gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {student.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Year {student.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {student.department}
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <Badge className="text-sm px-3 py-1">GPA: {student.gpa.toFixed(2)}</Badge>
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  Avg Score: {avgScore}
                </Badge>
                <Badge variant="outline" className="text-sm px-3 py-1">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {enrolledCourseDetails.length} Courses
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Grades & Progress</CardTitle>
        </CardHeader>
        <CardContent>
          {grades.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4 text-center">No grades recorded yet.</p>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Course</TableHead>
                    <TableHead className="text-center">Grade</TableHead>
                    <TableHead className="text-center">Score</TableHead>
                    <TableHead>Semester</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((grade) => {
                    const course = courses.find((c) => c.id === grade.courseId);
                    return (
                      <TableRow key={grade.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium text-sm">{course?.name || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">{course?.code}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={
                              grade.grade.startsWith("A")
                                ? "default"
                                : grade.grade.startsWith("B")
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {grade.grade}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-medium">{grade.score}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{grade.semester}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enrolled Courses */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Enrolled Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {enrolledCourseDetails.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/40 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{course.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {course.code} · {course.credits} credits
                  </p>
                </div>
                <Badge variant="outline">{course.department}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

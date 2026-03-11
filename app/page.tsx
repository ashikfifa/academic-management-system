"use client";

import { useEffect, useState } from "react";
import { GraduationCap, BookOpen, Users } from "lucide-react";
import { Student, Course, Faculty } from "@/types";
import { getStudents } from "@/lib/api/students";
import { getCourses } from "@/lib/api/courses";
import { getFaculty } from "@/lib/api/faculty";
import StatCard from "@/components/dashboard/StatCard";
import TopStudentsTable from "@/components/dashboard/TopStudentsTable";
import EnrollmentChart from "@/components/dashboard/EnrollmentChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [s, c, f] = await Promise.all([
          getStudents(),
          getCourses(),
          getFaculty(),
        ]);
        setStudents(s);
        setCourses(c);
        setFaculty(f);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Most popular courses sorted by enrollment
  const popularCourses = [...courses]
    .map((course) => ({
      ...course,
      enrollmentCount: students.filter((s) =>
        s.enrolledCourses.includes(course.id)
      ).length,
    }))
    .sort((a, b) => b.enrollmentCount - a.enrollmentCount);

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Students"
          value={students.length}
          icon={GraduationCap}
          description="Enrolled students"
          gradient="bg-gradient-to-br from-indigo-500 to-purple-600"
        />
        <StatCard
          title="Total Courses"
          value={courses.length}
          icon={BookOpen}
          description="Active courses"
          gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
        />
        <StatCard
          title="Faculty Members"
          value={faculty.length}
          icon={Users}
          description="Teaching staff"
          gradient="bg-gradient-to-br from-orange-500 to-rose-600"
        />
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Chart */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Course Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <EnrollmentChart courses={courses} students={students} />
          </CardContent>
        </Card>

        {/* Popular Courses */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Most Popular Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {popularCourses.slice(0, 6).map((course, index) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-sm">{course.name}</p>
                      <p className="text-xs text-muted-foreground">{course.code} · {course.department}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">{course.enrollmentCount} enrolled</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Students Leaderboard */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">🏆 Top Students by GPA</CardTitle>
        </CardHeader>
        <CardContent>
          <TopStudentsTable students={students} />
        </CardContent>
      </Card>
    </div>
  );
}

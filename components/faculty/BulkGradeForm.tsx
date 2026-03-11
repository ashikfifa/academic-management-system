"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bulkGradeSchema, BulkGradeSchemaType } from "@/lib/validations/grade";
import { Course, Student, Grade } from "@/types";
import { getCourses } from "@/lib/api/courses";
import { getStudents } from "@/lib/api/students";
import { getGradesByCourseId, createGrade, updateGrade } from "@/lib/api/grades";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const GRADE_LETTERS = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];

export default function BulkGradeForm() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [loadingInitial, setLoadingInitial] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loadingGrades, setLoadingGrades] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BulkGradeSchemaType>({
    resolver: zodResolver(bulkGradeSchema),
    defaultValues: {
      courseId: 0,
      grades: [],
    },
  });

  const { fields, replace } = useFieldArray({
    control,
    name: "grades",
  });

  const selectedCourseId = watch("courseId");

  useEffect(() => {
    Promise.all([getCourses(), getStudents()]).then(([c, s]) => {
      setCourses(c);
      setAllStudents(s);
    }).catch(console.error).finally(() => setLoadingInitial(false));
  }, []);

  // When course changes, load students and existing grades to map them into the form
  useEffect(() => {
    if (selectedCourseId <= 0) {
      replace([]);
      return;
    }

    const loadCourseData = async () => {
      setLoadingGrades(true);
      try {
        const existingRecordings = await getGradesByCourseId(selectedCourseId);
        
        // Find students enrolled in this course
        const enrolledStudents = allStudents.filter(s => s.enrolledCourses.includes(selectedCourseId));
        
        // Map enrolled students to form fields
        const gradeForms = enrolledStudents.map(student => {
          const existing = existingRecordings.find(g => g.studentId === student.id);
          return {
            studentId: student.id,
            courseId: selectedCourseId,
            score: existing ? existing.score : 0,
            grade: existing ? existing.grade : "",
            semester: existing ? existing.semester : "Fall 2025",
            existingGradeId: existing ? existing.id : undefined,
          };
        });

        replace(gradeForms);
      } catch (error) {
        console.error("Failed to load grades for course", error);
      } finally {
        setLoadingGrades(false);
      }
    };

    loadCourseData();
  }, [selectedCourseId, allStudents, replace]);

  const getStudentName = (studentId: number) => {
    return allStudents.find(s => s.id === studentId)?.name || `Student ${studentId}`;
  };

  const calculateAutoGrade = (score: number) => {
    if (!score && score !== 0) return "";
    if (score >= 97) return "A+";
    if (score >= 93) return "A";
    if (score >= 90) return "A-";
    if (score >= 87) return "B+";
    if (score >= 83) return "B";
    if (score >= 80) return "B-";
    if (score >= 77) return "C+";
    if (score >= 73) return "C";
    if (score >= 70) return "C-";
    if (score >= 60) return "D";
    return "F";
  };

  const handleFormSubmit = async (data: BulkGradeSchemaType) => {
    setSubmitting(true);
    setSuccess(false);

    try {
      // Execute saves in parallel
      const promises = data.grades.map(entry => {
        if (entry.existingGradeId !== undefined) {
          // Update existing
          return updateGrade(entry.existingGradeId, {
            score: entry.score,
            grade: entry.grade,
            semester: entry.semester,
          });
        } else {
          // Create new record
          return createGrade({
            studentId: entry.studentId,
            courseId: entry.courseId,
            score: entry.score,
            grade: entry.grade,
            semester: entry.semester,
          });
        }
      });

      await Promise.all(promises);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (error) {
      console.error("Failed to update grades:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card className="shadow-sm border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base">1. Select Target Course</CardTitle>
          <CardDescription>
            Choose a course to load the enrolled students and their existing grades.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedCourseId > 0 ? selectedCourseId.toString() : ""}
            onValueChange={(val) => setValue("courseId", Number(val))}
          >
            <SelectTrigger className="max-w-md bg-background">
              <SelectValue placeholder="Select a course..." />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id.toString()}>
                  {course.code} - {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.courseId && (
            <p className="text-sm text-destructive mt-2">{errors.courseId.message}</p>
          )}
        </CardContent>
      </Card>

      {selectedCourseId > 0 && (
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-base">2. Update Enrolled Student Grades</CardTitle>
              <CardDescription>Enter numeric scores to auto-calculate grade letters.</CardDescription>
            </div>
            <Badge variant="secondary">{fields.length} Students</Badge>
          </CardHeader>
          <CardContent>
            {loadingGrades ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : fields.length === 0 ? (
              <Alert className="bg-muted border-none">
                <AlertCircle className="w-4 h-4" />
                <AlertTitle>No students enrolled</AlertTitle>
                <AlertDescription>
                  This course currently has no enrolled students. Use the Assignments tab to enroll students first.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4 pt-4 relative">
                <div className="grid grid-cols-12 gap-3 pb-2 text-sm font-medium text-muted-foreground border-b border-border mb-2 hidden sm:grid">
                  <div className="col-span-5 hidden sm:block">Student Name</div>
                  <div className="col-span-2 hidden sm:block">Score (0-100)</div>
                  <div className="col-span-2 hidden sm:block">Grade Letter</div>
                  <div className="col-span-3 hidden sm:block">Semester</div>
                </div>

                {fields.map((field, index) => {
                  const studentName = getStudentName(field.studentId);
                  const isExisting = field.existingGradeId !== undefined;
                  
                  return (
                    <div key={field.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center py-2 sm:py-0 border-b border-border sm:border-0 last:border-0">
                      
                      <div className="col-span-1 sm:col-span-5 font-medium sm:font-normal text-sm flex items-center gap-2">
                        {studentName}
                        {isExisting && (
                          <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] bg-emerald-100 text-emerald-800 rounded font-semibold whitespace-nowrap">
                            Recorded
                          </span>
                        )}
                      </div>

                      <div className="col-span-1 sm:col-span-2">
                        <Label className="sm:hidden text-xs text-muted-foreground mb-1 block">Score</Label>
                        <Input
                          type="number"
                          placeholder="Score"
                          className="h-9"
                          {...register(`grades.${index}.score` as const, {
                            onChange: (e) => {
                              const autoGrade = calculateAutoGrade(Number(e.target.value));
                              setValue(`grades.${index}.grade` as const, autoGrade);
                            }
                          })}
                        />
                        {errors.grades?.[index]?.score && (
                          <p className="text-[10px] text-destructive mt-1 absolute">{errors.grades[index].score?.message}</p>
                        )}
                      </div>

                      <div className="col-span-1 sm:col-span-2">
                        <Label className="sm:hidden text-xs text-muted-foreground mb-1 block">Grade</Label>
                        <Select
                          value={watch(`grades.${index}.grade` as const)}
                          onValueChange={(val) => setValue(`grades.${index}.grade` as const, val)}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="-" />
                          </SelectTrigger>
                          <SelectContent>
                            {GRADE_LETTERS.map((letter) => (
                              <SelectItem key={letter} value={letter}>
                                {letter}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.grades?.[index]?.grade && (
                          <p className="text-[10px] text-destructive mt-1 absolute">{errors.grades[index].grade?.message}</p>
                        )}
                      </div>

                      <div className="col-span-1 sm:col-span-3">
                        <Label className="sm:hidden text-xs text-muted-foreground mb-1 block">Semester</Label>
                        <Input
                          placeholder="e.g. Fall 2025"
                          className="h-9"
                          {...register(`grades.${index}.semester` as const)}
                        />
                        {errors.grades?.[index]?.semester && (
                          <p className="text-[10px] text-destructive mt-1 absolute">{errors.grades[index].semester?.message}</p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {success && (
                  <Alert className="bg-emerald-50 text-emerald-900 border-emerald-200 mt-6">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <AlertDescription>
                      Grades successfully recorded for all students!
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end pt-4 mt-6 border-t border-border">
                  <Button type="submit" disabled={submitting || fields.length === 0} className="gap-2 min-w-[200px]">
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Publish All Grades
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </form>
  );
}

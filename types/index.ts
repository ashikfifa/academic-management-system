export interface Student {
  id: number;
  name: string;
  email: string;
  year: number;
  department: string;
  gpa: number;
  enrolledCourses: number[];
  avatar: string;
}

export interface Course {
  id: number;
  code: string;
  name: string;
  department: string;
  credits: number;
  facultyId: number;
  maxEnrollment: number;
  description: string;
}

export interface Faculty {
  id: number;
  name: string;
  email: string;
  department: string;
  title: string;
  courseIds: number[];
}

export interface Grade {
  id: number;
  studentId: number;
  courseId: number;
  grade: string;
  score: number;
  semester: string;
}

export type StudentFormData = Omit<Student, "id">;
export type CourseFormData = Omit<Course, "id">;
export type FacultyFormData = Omit<Faculty, "id">;

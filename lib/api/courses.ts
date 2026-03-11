import api from "./axios";
import { Course, CourseFormData } from "@/types";

export async function getCourses(): Promise<Course[]> {
  const { data } = await api.get<Course[]>("/courses");
  return data;
}

export async function getCourseById(id: number): Promise<Course> {
  const { data } = await api.get<Course>(`/courses/${id}`);
  return data;
}

export async function createCourse(course: CourseFormData): Promise<Course> {
  const { data } = await api.post<Course>("/courses", course);
  return data;
}

export async function updateCourse(id: number, course: Partial<CourseFormData>): Promise<Course> {
  const { data } = await api.put<Course>(`/courses/${id}`, course);
  return data;
}

export async function deleteCourse(id: number): Promise<void> {
  await api.delete(`/courses/${id}`);
}

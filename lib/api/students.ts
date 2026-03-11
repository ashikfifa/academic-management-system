import api from "./axios";
import { Student, StudentFormData } from "@/types";

export async function getStudents(): Promise<Student[]> {
  const { data } = await api.get<Student[]>("/students");
  return data;
}

export async function getStudentById(id: number): Promise<Student> {
  const { data } = await api.get<Student>(`/students/${id}`);
  return data;
}

export async function createStudent(student: StudentFormData): Promise<Student> {
  const { data } = await api.post<Student>("/students", student);
  return data;
}

export async function updateStudent(id: number, student: Partial<StudentFormData>): Promise<Student> {
  const { data } = await api.put<Student>(`/students/${id}`, student);
  return data;
}

export async function deleteStudent(id: number): Promise<void> {
  await api.delete(`/students/${id}`);
}

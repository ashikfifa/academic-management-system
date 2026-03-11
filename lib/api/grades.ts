import api from "./axios";
import { Grade } from "@/types";

export async function getGrades(): Promise<Grade[]> {
  const { data } = await api.get<Grade[]>("/grades");
  return data;
}

export async function getGradesByStudentId(studentId: number): Promise<Grade[]> {
  const { data } = await api.get<Grade[]>(`/grades?studentId=${studentId}`);
  return data;
}

export async function getGradesByCourseId(courseId: number): Promise<Grade[]> {
  const { data } = await api.get<Grade[]>(`/grades?courseId=${courseId}`);
  return data;
}

export async function createGrade(grade: Omit<Grade, "id">): Promise<Grade> {
  const { data } = await api.post<Grade>("/grades", grade);
  return data;
}

export async function updateGrade(id: number, grade: Partial<Omit<Grade, "id">>): Promise<Grade> {
  const { data } = await api.put<Grade>(`/grades/${id}`, grade);
  return data;
}

export async function deleteGrade(id: number): Promise<void> {
  await api.delete(`/grades/${id}`);
}

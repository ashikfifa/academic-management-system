import api from "./axios";
import { Faculty, FacultyFormData } from "@/types";

export async function getFaculty(): Promise<Faculty[]> {
  const { data } = await api.get<Faculty[]>("/faculty");
  return data;
}

export async function getFacultyById(id: number): Promise<Faculty> {
  const { data } = await api.get<Faculty>(`/faculty/${id}`);
  return data;
}

export async function createFaculty(faculty: FacultyFormData): Promise<Faculty> {
  const { data } = await api.post<Faculty>("/faculty", faculty);
  return data;
}

export async function updateFaculty(id: number, faculty: Partial<FacultyFormData>): Promise<Faculty> {
  const { data } = await api.put<Faculty>(`/faculty/${id}`, faculty);
  return data;
}

export async function deleteFaculty(id: number): Promise<void> {
  await api.delete(`/faculty/${id}`);
}

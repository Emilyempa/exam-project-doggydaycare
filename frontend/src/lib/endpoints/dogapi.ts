import { api } from '../api';

export interface DogResponse {
  id: string; // UUID
  name: string;
  age: number;
  breed?: string;
  dogInfo?: string;
  userId: string;
}

export interface DogCreateRequest {
  name: string;
  age: number;
  breed?: string;
  dogInfo?: string;
  userId: string;
}

export interface DogUpdateRequest {
  name?: string;
  age?: number;
  breed?: string;
  dogInfo?: string;
}

export const dogApi = {
  getAll: () => api.get<DogResponse[]>('/dogs'),
  getById: (id: string) => api.get<DogResponse>(`/dogs/${id}`),
  create: (dog: DogCreateRequest) => api.post<DogResponse>('/dogs', dog),
  update: (id: string, dog: DogUpdateRequest) => api.put<DogResponse>(`/dogs/${id}`, dog),
  delete: (id: string) => api.delete<void>(`/dogs/${id}`),
};

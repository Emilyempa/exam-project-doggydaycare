import { api } from '../api';

export interface DogResponse {
  id: string; // UUID
  name: string;
  breed?: string;
  ownerId: string;
}

export interface DogCreateRequest {
  name: string;
  breed?: string;
  ownerId: string;
}

export interface DogUpdateRequest {
  name?: string;
  breed?: string;
  ownerId?: string;
}

export const dogApi = {
  getAll: () => api.get<DogResponse[]>('/dogs'),
  getById: (id: string) => api.get<DogResponse>(`/dogs/${id}`),
  create: (dog: DogCreateRequest) => api.post<DogResponse>('/dogs', dog),
  update: (id: string, dog: DogUpdateRequest) => api.put<DogResponse>(`/dogs/${id}`, dog),
  delete: (id: string) => api.delete<void>(`/dogs/${id}`),
};

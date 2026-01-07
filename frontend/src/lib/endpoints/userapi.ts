import { api } from '../api';

export interface Dog {
  id: string; // UUID
  name: string;
}

export interface UserResponse {
  id: string; // UUID
  fullName: string;
  email: string;
  mobileNumber: string;
  dogs?: Dog[];
}

export interface UserCreateRequest {
  fullName: string;
  email: string;
  mobileNumber: string;
}

export interface UserUpdateRequest {
  fullName?: string;
  email?: string;
  mobileNumber?: string;
}

export const userApi = {
  getAll: () => api.get<UserResponse[]>('/users'),
  getById: (id: string) => api.get<UserResponse>(`/users/${id}`),
  getDogsByUserId: (userId: string) => api.get<Dog[]>(`/users/${userId}/dogs`),
  create: (user: UserCreateRequest) => api.post<UserResponse>('/users', user),
  update: (id: string, user: UserUpdateRequest) => api.put<UserResponse>(`/users/${id}`, user),
  delete: (id: string) => api.delete<void>(`/users/${id}`),
};

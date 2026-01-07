import { api } from '../api';

export interface Dog {
  id: string; // UUID
  name: string;
}

export interface UserResponse {
  id: string; // UUID
  fullname: string;
  email: string;
  phone: string;
  dogs: Dog[];
}

export interface UserCreateRequest {
  fullname: string;
  email: string;
  phone: string;
}

export interface UserUpdateRequest {
  fullname?: string;
  email?: string;
  phone?: string;
}

export const userApi = {
  getAll: () => api.get<UserResponse[]>('/users'),
  getById: (id: string) => api.get<UserResponse>(`/users/${id}`),
  create: (user: UserCreateRequest) => api.post<UserResponse>('/users', user),
  update: (id: string, user: UserUpdateRequest) => api.put<UserResponse>(`/users/${id}`, user),
  delete: (id: string) => api.delete<void>(`/users/${id}`),
};

import { api } from '../api';

export interface Dog {
  id: string; // UUID
  name: string;
}

export interface UserResponse {
  id: string; // UUID
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  emergencyContact: string;
  enabled: boolean;
  dogs?: Dog[];
}

export interface UserCreateRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  emergencyContact: string;
}

export interface UserUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobileNumber?: string;
  emergencyContact?: string;
  enabled: boolean;
}

export const userApi = {
  getAll: () => api.get<UserResponse[]>('/users'),
  getById: (id: string) => api.get<UserResponse>(`/users/${id}`),
  getDogsByUserId: (userId: string) => api.get<Dog[]>(`/users/${userId}/dogs`),
  create: (user: UserCreateRequest) => api.post<UserResponse>('/users', user),
  update: (id: string, user: UserUpdateRequest) => api.put<UserResponse>(`/users/${id}`, user),
  delete: (id: string) => api.delete<void>(`/users/${id}`),
};

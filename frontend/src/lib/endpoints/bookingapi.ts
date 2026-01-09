import { api } from '../api';

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export interface BookingResponse {
  id: string;
  dogId: string;
  dogName: string;
  bookedById: string;
  date: string; // LocalDate as ISO string (YYYY-MM-DD)
  expectedCheckInTime: string; // LocalTime as string (HH:mm:ss)
  expectedCheckOutTime: string; // LocalTime as string (HH:mm:ss)
  actualCheckInTime: string | null; // LocalTime as string or null
  actualCheckOutTime: string | null; // LocalTime as string or null
  status: BookingStatus;
  notes: string | null;
  createdAt: string; // LocalDateTime as ISO string
  updatedAt: string; // LocalDateTime as ISO string
}

export interface BookingCreateRequest {
  dogId: string;
  bookedById: string;
  date: string; // LocalDate as ISO string (YYYY-MM-DD)
  expectedCheckInTime: string; // LocalTime as string (HH:mm:ss)
  expectedCheckOutTime: string; // LocalTime as string (HH:mm:ss)
  notes?: string | null;
}

export interface BookingUpdateRequest {
  date?: string | null; // LocalDate as ISO string (YYYY-MM-DD)
  expectedCheckInTime?: string | null; // LocalTime as string (HH:mm:ss)
  expectedCheckOutTime?: string | null; // LocalTime as string (HH:mm:ss)
  notes?: string | null;
}

export const bookingApi = {
  // Create
  create: (booking: BookingCreateRequest) =>
    api.post<BookingResponse>('/bookings', booking),

  // Read
  getAll: () =>
    api.get<BookingResponse[]>('/bookings'),

  getById: (id: string) =>
    api.get<BookingResponse>(`/bookings/${id}`),

  getByDate: (date: string) =>
    api.get<BookingResponse[]>(`/bookings/date/${date}`),

  getByDogId: (dogId: string) =>
    api.get<BookingResponse[]>(`/bookings/dog/${dogId}`),

  getByUserId: (userId: string) =>
    api.get<BookingResponse[]>(`/bookings/user/${userId}`),

  getByStatus: (status: BookingStatus) =>
    api.get<BookingResponse[]>(`/bookings/status/${status}`),

  // Update
  update: (id: string, booking: BookingUpdateRequest) =>
    api.put<BookingResponse>(`/bookings/${id}`, booking),

  // Booking lifecycle actions
  checkIn: (id: string) =>
    api.post<BookingResponse>(`/bookings/${id}/check-in`),

  checkOut: (id: string) =>
    api.post<BookingResponse>(`/bookings/${id}/check-out`),

  cancel: (id: string) =>
    api.post<BookingResponse>(`/bookings/${id}/cancel`),

  // Delete (soft)
  delete: (id: string) =>
    api.delete<void>(`/bookings/${id}`)
};

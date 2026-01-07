//Base-functionality for API

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const API_PREFIX = '/api/v1';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Help functions for auth-token (for future use)
const getAuthToken = (): string | null => {
  if (typeof globalThis === 'undefined') return null;
  return localStorage.getItem('authToken');
};

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  body?: any;
}

// Main API request function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> => {
  const {
    method = 'GET',
    body = null,
    headers = {},
    requiresAuth = false,
    ...customConfig
  } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers as Record<string, string>),
    },
    ...customConfig,
  };

  // Add auth-token when needed (for future use)
  if (requiresAuth) {
    const token = getAuthToken();
    if (token) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  // Add a body if there is one
  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${API_PREFIX}${endpoint}`,
      config
    );

    // Handle 204 No Content
    if (response.status === 204) {
      return null as T;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new ApiError(
        data.message || `Request failed: ${endpoint}`,
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // NNetwork error or other server error
    throw new ApiError(
      'Could not connect to server. Please check your internet connection and try again.',
      0,
      { originalError: error }
    );
  }
};

// Exported methods
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'POST', body }),

  put: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'PUT', body }),

  patch: <T>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'PATCH', body }),

  delete: <T>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

export { ApiError };

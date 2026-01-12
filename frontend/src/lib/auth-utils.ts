export interface User {
  id: number;
  email: string;
  role: string;
}

export const getToken = (): string | null => {
  if (typeof globalThis.window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const getUser = (): User | null => {
  if (typeof globalThis.window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  globalThis.window.location.href = '/login';
};

export const hasRole = (requiredRole: string): boolean => {
  const user = getUser();
  if (!user) return false;

  const roleHierarchy: { [key: string]: string[] } = {
    'ADMIN': ['ADMIN'],
    'STAFF': ['STAFF'],
    'OWNER': ['OWNER']
  };

  return roleHierarchy[user.role]?.includes(requiredRole) || false;
};

// Fetch wrapper that automatically adds JWT token
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();

  const headers = {
    ...options.headers,
    'Authorization': token ? `Bearer ${token}` : '',
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // OIf 401, log out user
  if (response.status === 401) {
    logout();
    throw new Error('Unauthorized');
  }

  return response;
};

// Hook for protected routes
export const useAuth = () => {
  const user = getUser();
  const token = getToken();

  return {
    user,
    token,
    isAuthenticated: !!token,
    hasRole,
    logout,
  };
};

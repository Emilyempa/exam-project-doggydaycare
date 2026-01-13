// ===============================
// Types
// ===============================

export interface User {
  id: string;        // UUID from backend
  email: string;
  role: string;      // ADMIN | STAFF | OWNER
}

// ===============================
// Token helpers
// ===============================

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

// ===============================
// User helpers
// ===============================

export const getUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");
  if (!userStr) return null;

  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// ===============================
// Logout
// ===============================

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

// ===============================
// Role checking
// ===============================

export const hasRole = (requiredRole: string): boolean => {
  const user = getUser();
  if (!user) return false;

  return user.role === requiredRole;
};

// ===============================
// Authenticated fetch wrapper
// ===============================

export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getToken();

  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    logout();
    throw new Error("Unauthorized");
  }

  return response;
};

// ===============================
// Hook for components
// ===============================

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

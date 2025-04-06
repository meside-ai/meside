/**
 * Authentication storage utility for managing tokens in localStorage
 */

// Check if code is running in browser environment
const isBrowser = (): boolean => {
  return typeof window !== "undefined";
};

// Set authentication tokens
export const setAuthTokens = (token: string, refreshToken: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
};

// Get the authentication token
export const getAuthToken = (): string | null => {
  if (!isBrowser()) return null;
  return localStorage.getItem("token");
};

// Get the refresh token
export const getRefreshToken = (): string | null => {
  if (!isBrowser()) return null;
  return localStorage.getItem("refreshToken");
};

// Clear all authentication tokens
export const clearAuthTokens = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

// Check if user is authenticated (has a token)
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

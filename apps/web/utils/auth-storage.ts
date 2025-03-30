/**
 * Authentication storage utility for managing tokens in localStorage
 */

// Set authentication tokens
export const setAuthTokens = (token: string, refreshToken: string): void => {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
};

// Get the authentication token
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

// Get the refresh token
export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken");
};

// Clear all authentication tokens
export const clearAuthTokens = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

// Check if user is authenticated (has a token)
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

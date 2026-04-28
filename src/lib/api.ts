import { getToken } from "../utils/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

/**
 * Custom Error class for API errors
 * Provides structured error information
 */
export class APIError extends Error {
  constructor(
    public status: number,
    public message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = "APIError";
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }

  get isAuthError(): boolean {
    return this.status === 401 || this.status === 403;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }
}

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
          ...options,
          headers: {
              "Content-Type": "application/json",
              Authorization: token ? `Bearer ${token}` : "",
              ...(options.headers || {}),
          },
      });

      if (!res.ok) {
          // Handle authentication errors
          if (res.status === 401 && typeof window !== "undefined") {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              sessionStorage.removeItem("token");
              sessionStorage.removeItem("role");
              window.location.href = "/login";
          }
          
          let errorMessage = `API error: ${res.status}`;
          try {
              const errorData = await res.json();
              errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (e) {
              // If response is not JSON, use status message
          }
          
          throw new APIError(res.status, errorMessage);
      }

      return res.json() as Promise<T>;
    } catch (error) {
      // Handle network errors
      if (error instanceof APIError) {
        throw error;
      }

      if (error instanceof TypeError) {
        // Network error
        throw new APIError(0, "Network error: Unable to reach the server", error as Error);
      }

      throw new APIError(500, "An unexpected error occurred", error as Error);
    }
}

/**
 * User-friendly error message helper
 * Convert error codes to readable messages
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    if (error.isNetworkError) {
      return "No internet connection. Please check your network.";
    }
    if (error.isAuthError) {
      return "You are not authorized to perform this action.";
    }
    if (error.isServerError) {
      return "Server error. Please try again later.";
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred";
}


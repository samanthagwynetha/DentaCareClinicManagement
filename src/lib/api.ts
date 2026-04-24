import { getToken } from "../utils/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        if (res.status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("role");
            window.location.href = "/login";
        }
        throw new Error(`API error: ${res.status}`);
    }

    return res.json() as Promise<T>;
}

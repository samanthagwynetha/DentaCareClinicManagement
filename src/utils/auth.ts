export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const getRole = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("role") || sessionStorage.getItem("role");
};

export const setAuth = (token: string, role: string, remember: boolean) => {
  if (typeof window === "undefined") return;
  
  if (remember) {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("role");
  } else {
    sessionStorage.setItem("token", token);
    sessionStorage.setItem("role", role);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }
};

export const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
};

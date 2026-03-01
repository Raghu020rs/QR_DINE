export const API_BASE = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/+$/, "");

export const APP_BASE =
  import.meta.env.VITE_APP_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "http://localhost:5173");

export const apiUrl = (path) => {
  if (!path) {
    return API_BASE;
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
};

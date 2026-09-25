import api from "./api";

export async function register(data) {
  const { data: result } = await api.post("/register", data);
  return result;
}

export async function login(data) {
  const { data: result } = await api.post("/login", data);
  localStorage.setItem("access_token", result.access_token);
  localStorage.setItem("refresh_token", result.refresh_token || "");
  localStorage.setItem("user", JSON.stringify(result.user));
  return result;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

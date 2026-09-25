export function isLoggedIn() {
  return Boolean(localStorage.getItem("access_token"));
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

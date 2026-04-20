export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

const storageKey = "sustainesUser";

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(storageKey);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setStoredUser(user: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey, JSON.stringify(user));
}

export function clearStoredUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(storageKey);
}

export function getAuthHeaders() {
  const current = getStoredUser();
  if (!current) return {};
  return {
    "X-User-Role": current.role || "",
    "X-User-Id": current.id?.toString() || "",
  };
}

export function isAdmin(): boolean {
  const current = getStoredUser();
  // Küçük/Büyük harf duyarlılığını önlemek için toLowerCase kullanıyoruz
  return current?.role?.toLowerCase() === "admin";
}
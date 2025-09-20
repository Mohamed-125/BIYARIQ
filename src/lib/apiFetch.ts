// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = {
    // "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    "Content-Type": "application/json",
    "x-api-key": API_KEY || "",
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
}

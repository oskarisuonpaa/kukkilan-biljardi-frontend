export function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  return "http://localhost:3000";
}

type ApiInit = RequestInit & { next?: { revalidate?: number } };

export async function apiFetch<T>(
  path: string,
  init: ApiInit = {}
): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  const response = await fetch(url, {
    cache: "no-store",
    next: { revalidate: 0, ...(init.next ?? {}) },
    ...init,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Request failed ${response.status}: ${text || url}`);
  }

  return response.json() as Promise<T>;
}

export async function fetchContactInfo<T = unknown>() {
  return apiFetch<T>("/api/contact-info");
}

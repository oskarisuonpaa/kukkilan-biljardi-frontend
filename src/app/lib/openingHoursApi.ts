// src/app/lib/openingHoursApi.ts
import type {
  OpeningHourResponse,
  UpsertOpeningHourRequest,
  OpeningExceptionResponse,
  UpsertOpeningExceptionRequest,
  ExceptionsQuery,
} from "./definitions";

/**
 * Wrap fetch with consistent error handling.
 */
async function apiRequest<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Request failed with status ${response.status}: ${
        body || (typeof input === "string" ? input : "request")
      }`
    );
  }
  // For 204 No Content, do not attempt to parse json.
  if (response.status === 204) {
    return undefined as unknown as T;
  }
  return (await response.json()) as T;
}

// ===== Regular Opening Hours =====

export async function listOpeningHours(): Promise<OpeningHourResponse[]> {
  return apiRequest<OpeningHourResponse[]>("/api/opening-hours", {
    method: "GET",
  });
}

/**
 * Put (insert or update) opening hours for one weekday.
 * @param weekday 1 = Monday … 7 = Sunday
 */
export async function upsertOpeningHour(
  weekday: number,
  payload: UpsertOpeningHourRequest
): Promise<void> {
  await apiRequest<void>(`/api/opening-hours/${weekday}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Delete opening hours for one weekday (treat as "closed" for that weekday).
 */
export async function deleteOpeningHour(weekday: number): Promise<void> {
  await apiRequest<void>(`/api/opening-hours/${weekday}`, { method: "DELETE" });
}

// ===== Opening Exceptions =====

export async function listOpeningExceptions(
  query?: ExceptionsQuery
): Promise<OpeningExceptionResponse[]> {
  const params = new URLSearchParams();
  if (query?.from) params.set("from", query.from);
  if (query?.to) params.set("to", query.to);
  const qs = params.toString();
  const url = `/api/opening-hours/exceptions${qs ? `?${qs}` : ""}`;
  return apiRequest<OpeningExceptionResponse[]>(url, { method: "GET" });
}

export async function upsertOpeningException(
  date: string,
  payload: UpsertOpeningExceptionRequest
): Promise<void> {
  await apiRequest<void>(`/api/opening-hours/exceptions/${date}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteOpeningException(date: string): Promise<void> {
  await apiRequest<void>(`/api/opening-hours/exceptions/${date}`, {
    method: "DELETE",
  });
}

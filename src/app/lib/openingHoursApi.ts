import { getBaseUrl } from "./api";
import { OpeningDay, OpeningException } from "./definitions";

const API_BASE = getBaseUrl();

export async function fetchOpeningDays(): Promise<OpeningDay[]> {
  const r = await fetch(`${API_BASE}/api/opening-hours`, { cache: "no-store" });
  if (!r.ok) throw new Error("Failed to load opening hours");
  return r.json();
}

export async function saveOpeningDays(
  days: OpeningDay[]
): Promise<OpeningDay[]> {
  const r = await fetch(`${API_BASE}/api/opening-hours`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(days),
  });
  if (!r.ok) throw new Error("Failed to save opening hours");
  return r.json();
}

export async function fetchOpeningExceptions(): Promise<OpeningException[]> {
  const r = await fetch(`${API_BASE}/api/opening-hours/exceptions`, {
    cache: "no-store",
  });
  if (!r.ok) throw new Error("Failed to load exceptions");
  return r.json();
}

export async function createOpeningException(
  payload: Omit<OpeningException, "id">
) {
  const r = await fetch(`${API_BASE}/api/opening-hours/exceptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error("Failed to create exception");
  return (await r.json()) as OpeningException;
}

export async function updateOpeningException(
  id: number,
  payload: Omit<OpeningException, "id">
) {
  const r = await fetch(`${API_BASE}/api/opening-hours/exceptions/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) throw new Error("Failed to update exception");
  return (await r.json()) as OpeningException;
}

export async function deleteOpeningException(id: number) {
  const r = await fetch(`${API_BASE}/api/opening-hours/exceptions/${id}`, {
    method: "DELETE",
  });
  if (!r.ok) throw new Error("Failed to delete exception");
}

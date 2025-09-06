import { NextRequest, NextResponse } from "next/server";

/** Resolve backend base url once, fail fast if missing. */
export function getBackendUrl(): string {
  const base = process.env.BACKEND_URL?.replace(/\/$/, "");
  if (!base) {
    throw new Error("Missing BACKEND_URL environment variable");
  }
  return base;
}

/**
 * Forward a request to the backend, copying method, headers, and body.
 * Optionally append the original request's search params.
 */
export async function proxyRequest(
  req: NextRequest,
  backendPath: string,
  opts?: { includeSearchParams?: boolean }
) {
  const base = getBackendUrl();
  const url = new URL(base + backendPath);

  if (opts?.includeSearchParams) {
    const originalParams = req.nextUrl.searchParams;
    originalParams.forEach((value, key) => url.searchParams.set(key, value));
  }

  // Forward only safe headers
  const headers = new Headers();
  const contentType = req.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  // If you use auth, forward cookies or Authorization here:
  // headers.set("cookie", req.headers.get("cookie") ?? "");
  // headers.set("authorization", req.headers.get("authorization") ?? "");

  const init: RequestInit = {
    method: req.method,
    headers,
    body: ["GET", "HEAD"].includes(req.method) ? undefined : await req.text(),
    // Important: keep backend errors visible to the route handler caller
    redirect: "manual",
  };

  const res = await fetch(url.toString(), init);

  // Stream body back with same status and minimal headers
  const text = await res.text();
  const out = new NextResponse(text, { status: res.status });
  out.headers.set(
    "content-type",
    res.headers.get("content-type") ?? "text/plain; charset=utf-8"
  );
  return out;
}

/** Convenience helpers for common patterns */
export async function proxyJson(
  _req: NextRequest,
  method: "GET" | "POST" | "PUT" | "DELETE",
  backendPath: string,
  body?: unknown,
  searchParams?: Record<string, string | number | boolean | undefined | null>
) {
  const base = getBackendUrl();
  const url = new URL(base + backendPath);
  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  const res = await fetch(url, {
    method,
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") ?? "application/json",
    },
  });
}

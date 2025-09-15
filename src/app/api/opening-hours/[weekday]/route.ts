import { NextResponse } from "next/server";

function backend(): string {
  const origin = process.env.BACKEND_URL;
  if (!origin) {
    throw new Error(
      "Missing BACKEND_ORIGIN. Set it in .env.local (for example BACKEND_ORIGIN=http://localhost:4000)."
    );
  }
  return origin.replace(/\/+$/, "");
}

function parseWeekday(w: string): number | null {
  const n = Number(w);
  if (!Number.isInteger(n) || n < 1 || n > 7) return null;
  return n;
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ weekday: string }> }
) {
  const { weekday } = await context.params; // <-- important
  const weekdayNum = parseWeekday(weekday);
  if (weekdayNum === null) {
    return new NextResponse("Weekday must be an integer 1–7.", { status: 400 });
  }

  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.opens_at !== "string" ||
    typeof body.closes_at !== "string"
  ) {
    return new NextResponse(
      'Body must include "opens_at" and "closes_at" as strings.',
      { status: 400 }
    );
  }

  const url = `${backend()}/api/opening-hours/${weekdayNum}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return new NextResponse(text || "Failed to upsert opening hour", {
      status: response.status,
    });
  }

  return new NextResponse(null, { status: 204 });
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ weekday: string }> }
) {
  const { weekday } = await context.params; // <-- important
  const weekdayNum = parseWeekday(weekday);
  if (weekdayNum === null) {
    return new NextResponse("Weekday must be an integer 1–7.", { status: 400 });
  }

  const url = `${backend()}/api/opening-hours/${weekdayNum}`;
  const response = await fetch(url, { method: "DELETE" });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return new NextResponse(text || "Failed to delete opening hour", {
      status: response.status,
    });
  }

  return new NextResponse(null, { status: 204 });
}

import { NextResponse } from "next/server";

function backend(): string {
  const origin = process.env.BACKEND_URL;
  if (!origin) {
    throw new Error("Missing BACKEND_URL. Set it in .env.local.");
  }
  return origin.replace(/\/+$/, "");
}

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ date: string }> }
) {
  const { date } = await context.params; // <-- important
  if (!isIsoDate(date)) {
    return new NextResponse("Date must be in the format YYYY-MM-DD.", {
      status: 400,
    });
  }

  const body = await request.json().catch(() => null);
  if (
    !body ||
    typeof body.is_closed !== "boolean" ||
    (body.is_closed === false &&
      (typeof body.opens_at !== "string" || typeof body.closes_at !== "string"))
  ) {
    return new NextResponse(
      'Body must include "is_closed" (boolean). If not closed, include "opens_at" and "closes_at" as strings.',
      { status: 400 }
    );
  }

  const url = `${backend()}/api/opening-hours/exceptions/${date}`;
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return new NextResponse(text || "Failed to upsert opening exception", {
      status: response.status,
    });
  }

  return new NextResponse(null, { status: 204 });
}

export async function DELETE(
  _: Request,
  context: { params: Promise<{ date: string }> }
) {
  const { date } = await context.params; // <-- important
  if (!isIsoDate(date)) {
    return new NextResponse("Date must be in the format YYYY-MM-DD.", {
      status: 400,
    });
  }

  const url = `${backend()}/api/opening-hours/exceptions/${date}`;
  const response = await fetch(url, { method: "DELETE" });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return new NextResponse(text || "Failed to delete opening exception", {
      status: response.status,
    });
  }

  return new NextResponse(null, { status: 204 });
}

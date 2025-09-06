import { NextRequest, NextResponse } from "next/server";
import { proxyJson } from "../_lib/proxy";

/** GET /api/bookings?calendarId=NUMBER */
export async function GET(req: NextRequest) {
  const calendarId = req.nextUrl.searchParams.get("calendarId");
  if (!calendarId) {
    return new NextResponse("Missing calendarId", { status: 400 });
  }
  const idNum = Number(calendarId);
  if (!Number.isFinite(idNum) || idNum <= 0) {
    return new NextResponse("Invalid calendarId", { status: 400 });
  }
  // Proxy to backend, keep query server-side only
  return proxyJson(req, "GET", "/api/bookings", undefined, {
    calendarId: idNum,
  });
}

/** POST /api/bookings  (JSON body) */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return new NextResponse("Invalid JSON", { status: 400 });
  // Optionally validate here
  return proxyJson(req, "POST", "/api/bookings", body);
}

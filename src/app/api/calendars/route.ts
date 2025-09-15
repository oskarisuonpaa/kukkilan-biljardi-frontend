import { NextRequest } from "next/server";
import { proxyJson } from "../_lib/proxy";

export async function GET(req: NextRequest) {
  return proxyJson(req, "GET", "/api/calendars");
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return new Response("Invalid JSON", { status: 400 });
  return proxyJson(req, "POST", "/api/calendars", body);
}

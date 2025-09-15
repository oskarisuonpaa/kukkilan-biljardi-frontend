import { NextRequest } from "next/server";
import { proxyJson } from "../_lib/proxy";

/** GET regular weekly schedule */
export async function GET(req: NextRequest) {
  return proxyJson(req, "GET", "/api/opening-hours");
}

/** PUT regular weekly schedule */
export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return new Response("Invalid JSON", { status: 400 });
  return proxyJson(req, "PUT", "/api/opening-hours", body);
}

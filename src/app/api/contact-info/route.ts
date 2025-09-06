import { NextRequest } from "next/server";
import { proxyJson } from "../_lib/proxy";

export async function GET(req: NextRequest) {
  return proxyJson(req, "GET", "/api/contact-info");
}

export async function PUT(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return new Response("Invalid JSON", { status: 400 });
  return proxyJson(req, "PUT", "/api/contact-info", body);
}

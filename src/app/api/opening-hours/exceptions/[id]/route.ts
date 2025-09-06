import { NextRequest } from "next/server";
import { proxyJson } from "../../../_lib/proxy";

export async function PUT(req: NextRequest, ctx: { params: { id: string } }) {
  const id = Number(ctx.params.id);
  if (!Number.isFinite(id)) return new Response("Invalid id", { status: 400 });
  const body = await req.json().catch(() => null);
  if (!body) return new Response("Invalid JSON", { status: 400 });
  return proxyJson(req, "PUT", `/api/opening-hours/exceptions/${id}`, body);
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: { id: string } }
) {
  const id = Number(ctx.params.id);
  if (!Number.isFinite(id)) return new Response("Invalid id", { status: 400 });
  return proxyJson(req, "DELETE", `/api/opening-hours/exceptions/${id}`);
}

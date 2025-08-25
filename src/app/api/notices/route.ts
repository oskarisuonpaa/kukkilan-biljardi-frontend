export async function GET() {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return new Response("BACKEND_URL not configured", { status: 500 });
  }

  const response = await fetch(`${backendUrl}/api/notices`, {
    cache: "no-store",
  });
  if (!response.ok) {
    const errorText = await response
      .text()
      .catch(() => "Failed to fetch notices");
    return new Response(errorText, { status: response.status || 502 });
  }

  const notices = await response.json();
  return Response.json(notices, { status: 200 });
}

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return new Response("BACKEND_URL not configured", { status: 500 });
  }

  const requestBody = await request.json();

  const response = await fetch(`${backendUrl}/api/notices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response
      .text()
      .catch(() => "Failed to create notice");
    return new Response(errorText, { status: response.status || 502 });
  }

  const createdNotice = await response.json();
  return Response.json(createdNotice, { status: 201 });
}

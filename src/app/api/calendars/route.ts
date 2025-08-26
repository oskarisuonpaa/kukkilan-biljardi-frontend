export async function GET() {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return new Response("BACKEND_URL not configured", { status: 500 });
  }

  const response = await fetch(`${backendUrl}/api/calendars`, {
    cache: "no-store",
  });
  if (!response.ok) {
    const errorText = await response
      .text()
      .catch(() => "Failed to fetch calendars");
    return new Response(errorText, { status: response.status || 502 });
  }

  const calendars = await response.json();
  return Response.json(calendars, { status: 200 });
}

export async function POST(request: Request) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return new Response("BACKEND_URL not configured", { status: 500 });
  }

  const requestBody = await request.json();

  const response = await fetch(`${backendUrl}/api/calendars`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response
      .text()
      .catch(() => "Failed to create calendar");
    return new Response(errorText, { status: response.status || 502 });
  }

  const createdCalendar = await response.json();
  return Response.json(createdCalendar, { status: 201 });
}

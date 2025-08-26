export async function GET() {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return new Response("BACKEND_URL not configured", { status: 500 });
  }

  const response = await fetch(`${backendUrl}/api/contact-info`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response
      .text()
      .catch(() => "Failed to fetch contact info");
    return new Response(errorText, { status: response.status || 502 });
  }

  const contactInfo = await response.json();

  return Response.json(contactInfo, { status: 200 });
}

export async function PUT(request: Request) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return new Response("BACKEND_URL not configured", { status: 500 });
  }

  const requestBody = await request.json();

  const response = await fetch(`${backendUrl}/api/contact-info`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response
      .text()
      .catch(() => "Failed to update contact info");
    return new Response(errorText, { status: response.status || 502 });
  }

  const responseData = await response.json();
  return Response.json(responseData, { status: response.status });
}

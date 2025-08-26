export async function GET() {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return new Response("BACKEND_URL not configured", { status: 500 });
  }

  const response = await fetch(`${backendUrl}/api/opening-hours`, {
    cache: "no-store",
  });
  if (!response.ok) {
    const errorText = await response
      .text()
      .catch(() => "Failed to fetch opening hours");
    return new Response(errorText, { status: response.status || 502 });
  }

  const openingHours = await response.json();
  return Response.json(openingHours, { status: 200 });
}

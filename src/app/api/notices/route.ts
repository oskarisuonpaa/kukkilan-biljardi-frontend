const BACKEND_BASE_URL = process.env.BACKEND_URL;

const GET = async () => {
  const response = await fetch(`${BACKEND_BASE_URL}/api/notices`, {
    cache: "no-store",
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "Failed to fetch notices");
    return new Response(text, { status: response.status || 502 });
  }

  const data = await response.json();
  return Response.json(data);
};

const POST = async (request: Request) => {
  const body = await request.json();
  const response = await fetch(`${BACKEND_BASE_URL}/api/notices`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "Failed to create notice");
    return new Response(text, { status: response.status || 502 });
  }

  const data = await response.json();
  return Response.json(data, { status: 201 });
};

export { GET, POST };

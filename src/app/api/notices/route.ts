const BACKEND_BASE_URL = process.env.BACKEND_URL;

const GET = async () => {
  const response = await fetch(`${BACKEND_BASE_URL}/api/notices`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return new Response("Failed to fetch notices", { status: 500 });
  }

  const data = await response.json();
  return Response.json(data);
};

const POST = async (request: Request) => {
  const body = await request.json();
  const response = await fetch(`${BACKEND_BASE_URL}/api/notices`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    return new Response("Failed to update notice", { status: response.status });
  }

  const data = await response.json();
  return Response.json(data);
};

export { GET, POST };

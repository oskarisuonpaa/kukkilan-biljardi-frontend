export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
        return new Response("BACKEND_URL not configured", { status: 500 });
    }

    const requestBody = await request.json();

    const response = await fetch(`${backendUrl}/api/notices/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        cache: "no-store",
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => "Failed to update notice");
        return new Response(errorText, { status: response.status || 502 });
    }

    const responseData = await response.json();
    return Response.json(responseData, { status: response.status });
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const backendUrl = process.env.BACKEND_URL;
    if (!backendUrl) {
        return new Response("BACKEND_URL not configured", { status: 500 });
    }

    const response = await fetch(`${backendUrl}/api/notices/${params.id}`, {
        method: "DELETE",
        cache: "no-store",
    });

    if (!response.ok) {
        const errorText = await response.text().catch(() => "Failed to delete notice");
        return new Response(errorText, { status: response.status || 502 });
    }

    return new Response(null, { status: response.status });
}

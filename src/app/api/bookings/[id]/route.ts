export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("id");
  if (!bookingId) {
    return new Response("Missing bookingId", { status: 400 });
  }

  try {
    await deleteBooking(bookingId);
    return new Response("Booking deleted", { status: 204 });
  } catch {
    return new Response("Failed to delete booking", { status: 500 });
  }
}

const deleteBooking = async (bookingId: string) => {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return new Response("BACKEND_URL not configured", { status: 500 });
  }

  const response = await fetch(`${backendUrl}/api/bookings/${bookingId}`, {
    method: "DELETE",
  });

  if (!response.ok) throw new Error("Failed to delete booking");
  return response.json();
};

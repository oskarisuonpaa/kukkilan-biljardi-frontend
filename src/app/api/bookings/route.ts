import { CreateBookingParams } from "@/app/lib/definitions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const calendarId = searchParams.get("calendarId");
  if (!calendarId) {
    return new Response("Missing calendarId", { status: 400 });
  }

  try {
    const bookings = await fetchBookingsForCalendar(calendarId);
    return NextResponse.json(bookings);
  } catch {
    return new Response("Failed to fetch bookings", { status: 500 });
  }
}

export async function POST(request: Request) {
  const { calendarId, ...bookingData } = await request.json();
  if (!calendarId) {
    return new Response("Missing calendarId", { status: 400 });
  }

  try {
    const booking = await createBookingForCalendar(calendarId, bookingData);
    return NextResponse.json(booking);
  } catch {
    return new Response("Failed to create booking", { status: 500 });
  }
}

const fetchBookingsForCalendar = async (calendarId: string) => {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return new Response("BACKEND_URL not configured", { status: 500 });
  }

  const response = await fetch(
    `${backendUrl}/api/calendars/${calendarId}/bookings`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) throw new Error("Failed to fetch bookings");
  return response.json();
};

const createBookingForCalendar = async (
  calendarId: string,
  bookingData: CreateBookingParams
) => {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return new Response("BACKEND_URL not configured", { status: 500 });
  }

  const response = await fetch(
    `${backendUrl}/api/calendars/${calendarId}/bookings`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookingData),
    }
  );

  if (!response.ok) throw new Error("Failed to create booking");
  return response.json();
};

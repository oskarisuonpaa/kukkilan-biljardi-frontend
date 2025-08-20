import AdminBookingsPage from "@/components/admin/AdminBookingsPage";

type CalendarItem = { id: number; name: string; active: boolean };
type BookingItem = {
  id: number;
  calendar_id: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  start: string;
  end: string;
};

const fetchCalendars = async () => {
  const res = await fetch("http://localhost:3001/api/calendars", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch calendars");
  const data = await res.json();
  return data as CalendarItem[];
};

const fetchBookings = async (id: number) => {
  const res = await fetch(`http://localhost:3001/api/calendar/${id}/bookings`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch calendars");
  const data = await res.json();
  return data;
};

const Page = async () => {
  const calendars: CalendarItem[] = await fetchCalendars();
  const bookings: BookingItem[] = [];

  for (const calendar of calendars as {
    id: number;
    name: string;
    active: boolean;
  }[]) {
    const data: BookingItem[] = await fetchBookings(calendar.id);
    for (let i = 0; i < data.length; i++) {
      const booking = data[i];
      bookings.push(booking);
    }
  }

  return <AdminBookingsPage calendars={calendars} initialBookings={bookings} />;
};

export default Page;

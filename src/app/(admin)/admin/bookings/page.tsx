import { fetchBookings, fetchCalendars } from "@/app/lib/api";
import { BookingItem, CalendarItem } from "@/app/lib/definitions";
import AdminBookingsPage from "@/components/admin/AdminBookingsPage";

const Page = async () => {
  const calendars = await fetchCalendars<CalendarItem[]>();
  const bookings: BookingItem[] = [];

  for (const calendar of calendars as {
    id: number;
    name: string;
    active: boolean;
  }[]) {
    const data: BookingItem[] = await fetchBookings<BookingItem[]>(calendar.id);
    for (let i = 0; i < data.length; i++) {
      const booking = data[i];
      bookings.push(booking);
    }
  }

  return <AdminBookingsPage calendars={calendars} initialBookings={bookings} />;
};

export default Page;

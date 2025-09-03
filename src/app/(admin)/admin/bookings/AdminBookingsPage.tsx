"use client";

import { useMemo, useState } from "react";
import { CalendarItem, BookingItem } from "@/app/lib/definitions";
import BookingsList from "./components/BookingsList";
import CreateBookingSection from "@/app/(admin)/admin/bookings/components/CreateBookingSection";

const AdminBookingsPage = ({
  calendars,
  initialBookings,
}: {
  calendars: CalendarItem[];
  initialBookings: BookingItem[];
}) => {
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);

  const activeCalendars = useMemo(
    () => calendars.filter((calendar) => calendar.active),
    [calendars]
  );

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      <CreateBookingSection
        calendars={activeCalendars}
        bookings={bookings}
        setBookings={setBookings}
      />

      <BookingsList
        calendars={activeCalendars}
        allBookings={bookings}
        setAllBookings={setBookings}
      />
    </main>
  );
};

export default AdminBookingsPage;

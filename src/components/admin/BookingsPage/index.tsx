import { CalendarItem, BookingItem } from "@/app/lib/definitions";
import { useState } from "react";
import CreateBookingSection from "./CreateBookingSection";

const AdminBookingsPage = ({
  calendars,
  initialBookings,
}: {
  calendars: CalendarItem[];
  initialBookings: BookingItem[];
}) => {
  const [bookings, setBookings] = useState(initialBookings);

  return (
    <main>
      <CreateBookingSection
        calendars={calendars}
        bookings={bookings}
        setBookings={setBookings}
      />
    </main>
  );
};

export default AdminBookingsPage;

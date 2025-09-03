import { BookingItem, CalendarItem } from "@/app/lib/definitions";
import SectionWrapper from "@/components/SectionWrapper";
import useBookingsFilter, { SortDirection } from "../hooks/useBookingsFilter";
import { useCallback, useState } from "react";
import BookingsToolbar from "./BookingsToolbar";
import { formatDayWithWeekday, formatTime } from "../utils/datetime";
import BookingRowActions from "./BookingRowActions";

export type BookingsListProps = {
  calendars: CalendarItem[];
  allBookings: BookingItem[];
  setAllBookings: (
    value: BookingItem[] | ((previous: BookingItem[]) => BookingItem[])
  ) => void;
};

async function deleteBookingFromServer(id: number): Promise<Response> {
  return fetch(`http://localhost:3001/api/bookings/${id}`, {
    method: "DELETE",
  });
}

const BookingsList = ({
  calendars,
  allBookings,
  setAllBookings,
}: BookingsListProps) => {
  const [selectedCalendarId, setSelectedCalendarId] = useState<number>(
    calendars[0]?.id ?? 0
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const { groups, totalCount } = useBookingsFilter(
    allBookings,
    selectedCalendarId,
    searchQuery,
    sortDirection
  );

  const handleToggleSortDirection = useCallback(
    () => setSortDirection((previous) => (previous === "asc" ? "desc" : "asc")),
    []
  );

  const handleDeleteBooking = useCallback(
    async (id: number) => {
      const confirmed = confirm("Poistetaanko tämä varaus?");
      if (!confirmed) return;

      const previous = allBookings;
      setAllBookings((current) => current.filter((b) => b.id !== id));

      try {
        const response = await deleteBookingFromServer(id);
        if (!response.ok) throw new Error("Delete failed");
      } catch (error) {
        console.error(error);
        setAllBookings(previous);
        alert("Poisto epäonnistui. Yritä uudelleen.");
      }
    },
    [allBookings, setAllBookings]
  );

  const selectedCalendarName =
    calendars.find((c) => c.id === selectedCalendarId)?.name ?? "—";

  return (
    <SectionWrapper
      title="Varausten hallinta"
      headerChildren={
        <BookingsToolbar
          calendars={calendars}
          selectedCalendarId={selectedCalendarId}
          onChangeCalendarId={setSelectedCalendarId}
          searchQuery={searchQuery}
          onChangeSearchQuery={setSearchQuery}
          sortDirection={sortDirection}
          onToggleSortDirection={handleToggleSortDirection}
        />
      }
    >
      <div className="px-6 pb-6">
        <div className="mb-3 text-sm text-[var(--text-muted)]">
          {totalCount} booking{totalCount === 1 ? "" : "s"} in “
          {selectedCalendarName}”
        </div>
        {Object.entries(groups).map(([dayKey, items]) => {
          const day = new Date(`${dayKey}T00:00:00`);
          return (
            <section key={dayKey} className="space-y-3 mb-8">
              <h3 className="text-sm font-semibold tracking-wide text-[var(--text-muted)]">
                {formatDayWithWeekday(day)} • {items.length} item
                {items.length === 1 ? "" : "s"}
              </h3>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto rounded-xl border">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--bg)]">
                    <tr className="[&>th]:px-4 [&>th]:py-3 text-left">
                      <th>Time</th>
                      <th>Name</th>
                      <th>Contact</th>
                      <th>Notes</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="[&>tr:not(:last-child)]:border-b">
                    {items.map((booking) => {
                      const startDate = new Date(booking.start);
                      const endDate = new Date(booking.end);
                      return (
                        <tr
                          key={booking.id}
                          className="[&>td]:px-4 [&>td]:py-3"
                        >
                          <td className="whitespace-nowrap">
                            {formatTime(startDate)} – {formatTime(endDate)}
                          </td>
                          <td className="font-medium">{booking.name}</td>
                          <td className="space-y-1">
                            <div>
                              <a
                                className="underline"
                                href={`mailto:${booking.email}`}
                              >
                                {booking.email}
                              </a>
                            </div>
                            {booking.phone && (
                              <div>
                                <a
                                  className="underline"
                                  href={`tel:${booking.phone}`}
                                >
                                  {booking.phone}
                                </a>
                              </div>
                            )}
                          </td>
                          <td className="max-w-[28rem]">
                            {booking.notes ?? (
                              <span className="text-[var(--text-muted)]">
                                —
                              </span>
                            )}
                          </td>
                          <td className="text-right">
                            <BookingRowActions
                              onDelete={() => handleDeleteBooking(booking.id)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {items.map((booking) => {
                  const startDate = new Date(booking.start);
                  const endDate = new Date(booking.end);
                  return (
                    <article key={booking.id} className="rounded-xl border p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-[var(--text-muted)]">
                          {formatTime(startDate)} – {formatTime(endDate)}
                        </div>
                        <BookingRowActions
                          onDelete={() => handleDeleteBooking(booking.id)}
                        />
                      </div>
                      <div className="mt-1 font-medium">{booking.name}</div>
                      <div className="mt-2 text-sm">
                        <div>
                          <a
                            className="underline"
                            href={`mailto:${booking.email}`}
                          >
                            {booking.email}
                          </a>
                        </div>
                        {booking.phone && (
                          <div>
                            <a
                              className="underline"
                              href={`tel:${booking.phone}`}
                            >
                              {booking.phone}
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-sm">
                        {booking.notes ?? (
                          <span className="text-[var(--text-muted)]">
                            No notes
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </SectionWrapper>
  );
};

export default BookingsList;

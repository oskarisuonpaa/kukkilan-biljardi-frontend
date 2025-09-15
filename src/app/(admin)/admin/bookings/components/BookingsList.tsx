"use client";

import { useCallback, useMemo, useState } from "react";
import { BookingItem, CalendarItem } from "@/app/lib/definitions";
import SectionWrapper from "@/components/SectionWrapper";
import useBookingsFilter, { SortDirection } from "../hooks/useBookingsFilter";
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

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:3001";

async function deleteBookingFromServer(id: number): Promise<Response> {
  return fetch(`${API_BASE}/api/bookings/${id}`, { method: "DELETE" });
}

export default function BookingsList({
  calendars,
  allBookings,
  setAllBookings,
}: BookingsListProps) {
  // Prefer first active calendar; fallback to first; else 0
  const defaultCalendarId = useMemo(
    () => calendars.find((c) => c.active)?.id ?? calendars[0]?.id ?? 0,
    [calendars]
  );

  const [selectedCalendarId, setSelectedCalendarId] =
    useState<number>(defaultCalendarId);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const { groups, totalCount } = useBookingsFilter(
    allBookings,
    selectedCalendarId,
    searchQuery,
    sortDirection
  );

  const handleToggleSortDirection = useCallback(
    () => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc")),
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
        <div className="mb-3 text-sm text-muted">
          {totalCount} varaus{totalCount === 1 ? "" : "ta"} kalenterissa “
          {selectedCalendarName}”
        </div>

        {Object.entries(groups).map(([dayKey, items]) => {
          const day = new Date(`${dayKey}T00:00:00`);
          return (
            <section key={dayKey} className="space-y-3 mb-8 card p-0">
              <h3 className="px-6 pt-4 text-sm font-semibold tracking-wide text-muted">
                {formatDayWithWeekday(day)} • {items.length} rivi
                {items.length === 1 ? "" : "ä"}
              </h3>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto rounded-xl border border-subtle m-6 mt-2">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Aika</th>
                      <th>Nimi</th>
                      <th>Yhteystiedot</th>
                      <th>Lisätiedot</th>
                      <th className="text-right">Toiminnot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((booking) => {
                      const startDate = new Date(booking.start);
                      const endDate = new Date(booking.end);
                      return (
                        <tr key={booking.id}>
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
                              <span className="text-muted">—</span>
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
              <div className="md:hidden space-y-3 px-6 pb-6">
                {items.map((booking) => {
                  const startDate = new Date(booking.start);
                  const endDate = new Date(booking.end);
                  return (
                    <article key={booking.id} className="card p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted">
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
                          <span className="text-muted">Ei lisätietoja</span>
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
}

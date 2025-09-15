import { BookingItem } from "@/app/lib/definitions";
import { useMemo } from "react";
import { isoDateKey } from "../utils/datetime";

export type SortDirection = "asc" | "desc";

const useBookingsFilter = (
  allBookings: BookingItem[],
  selectedCalendarId: number,
  searchQuery: string,
  sortDirection: SortDirection
) => {
  return useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const selectedCalendarBookings = allBookings.filter(
      (b) => b.calendar_id === selectedCalendarId
    );

    const queried = normalizedQuery
      ? selectedCalendarBookings.filter((b) =>
          [b.name, b.email, b.phone, b.notes]
            .filter(Boolean)
            .some((value) =>
              String(value).toLowerCase().includes(normalizedQuery)
            )
        )
      : selectedCalendarBookings;

    const sorted = [...queried].sort((a, b) => {
      const aTime = +new Date(a.start);
      const bTime = +new Date(b.start);
      return sortDirection === "asc" ? aTime - bTime : bTime - aTime;
    });

    const groups = sorted.reduce<Record<string, BookingItem[]>>(
      (acc, booking) => {
        const key = isoDateKey(booking.start);
        (acc[key] ||= []).push(booking);
        return acc;
      },
      {}
    );

    return { groups, totalCount: sorted.length } as const;
  }, [allBookings, selectedCalendarId, searchQuery, sortDirection]);
};

export default useBookingsFilter;

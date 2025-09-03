"use client";

import { CalendarItem } from "@/app/lib/definitions";
import { SortDirection } from "../hooks/useBookingsFilter";

export type BookingsToolbarProps = {
  calendars: CalendarItem[];
  selectedCalendarId: number;
  onChangeCalendarId: (id: number) => void;
  searchQuery: string;
  onChangeSearchQuery: (value: string) => void;
  sortDirection: SortDirection;
  onToggleSortDirection: () => void;
};

const BookingsToolbar = ({
  calendars,
  selectedCalendarId,
  onChangeCalendarId,
  searchQuery,
  onChangeSearchQuery,
  sortDirection,
  onToggleSortDirection,
}: BookingsToolbarProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label className="flex items-center gap-2">
        <span className="text-sm text-[var(--text-muted)]">Kalenteri</span>
        <select
          className="rounded-lg border px-3 py-2"
          value={selectedCalendarId}
          onChange={(event) => onChangeCalendarId(Number(event.target.value))}
        >
          {calendars.map((calendar) => (
            <option key={calendar.id} value={calendar.id}>
              {calendar.name}
              {!calendar.active ? " (inactive)" : ""}
            </option>
          ))}
        </select>
      </label>

      <input
        type="search"
        placeholder="Haku: nimi, email, puh., muistiinpanot"
        className="w-full sm:w-72 rounded-lg border px-3 py-2"
        value={searchQuery}
        onChange={(event) => onChangeSearchQuery(event.target.value)}
      />

      <button onClick={onToggleSortDirection} className="button" type="button">
        Järjestä:{" "}
        {sortDirection === "asc"
          ? "Aikaisin → Myöhäisin"
          : "Myöhäisin → Aikaisin"}
      </button>
    </div>
  );
};

export default BookingsToolbar;

"use client";

import { CalendarItem } from "@/app/lib/definitions";
import SectionWrapper from "@/components/SectionWrapper";
import { useCallback } from "react";

type ManageCalendarsSectionProps = {
  calendars: CalendarItem[];
  setCalendars: React.Dispatch<React.SetStateAction<CalendarItem[]>>;
  baselineCalendars: CalendarItem[];
  setBaselineCalendars: React.Dispatch<React.SetStateAction<CalendarItem[]>>;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export default function ManageCalendarsSection({
  calendars,
  setCalendars,
  baselineCalendars,
  setBaselineCalendars,
}: ManageCalendarsSectionProps) {
  const handleNameChange = useCallback(
    (calendarId: number, calendarName: string) =>
      setCalendars((prev) =>
        prev.map((c) =>
          c.id === calendarId ? { ...c, name: calendarName } : c
        )
      ),
    [setCalendars]
  );

  const handleActiveChange = useCallback(
    (calendarId: number, isActive: boolean) =>
      setCalendars((prev) =>
        prev.map((c) => (c.id === calendarId ? { ...c, active: isActive } : c))
      ),
    [setCalendars]
  );

  const handleSubmitRow = useCallback(
    async (calendar: CalendarItem) => {
      const response = await fetch(`${API_BASE}/api/calendars/${calendar.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: calendar.name, active: calendar.active }),
      });

      if (!response.ok) throw new Error("Failed to update calendar");

      const saved: CalendarItem = await response.json();

      setCalendars((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));

      setBaselineCalendars((prev) =>
        prev.some((b) => b.id === saved.id)
          ? prev.map((b) => (b.id === saved.id ? saved : b))
          : [saved, ...prev]
      );
    },
    [setCalendars, setBaselineCalendars]
  );

  const handleDelete = useCallback(
    async (calendarId: number) => {
      if (!confirm("Poistetaanko tämä kalenteri?")) return;

      const previousCalendars = calendars;
      const previousBaseline = baselineCalendars;

      setCalendars((prev) => prev.filter((c) => c.id !== calendarId));
      setBaselineCalendars((prev) => prev.filter((c) => c.id !== calendarId));

      try {
        const response = await fetch(
          `${API_BASE}/api/calendars/${calendarId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) throw new Error("Delete failed");
      } catch (error) {
        console.error(error);
        // Rollback
        setCalendars(previousCalendars);
        setBaselineCalendars(previousBaseline);
      }
    },
    [calendars, baselineCalendars, setCalendars, setBaselineCalendars]
  );

  const resetRow = useCallback(
    (calendarId: number) => {
      const original = baselineCalendars.find((c) => c.id === calendarId);
      setCalendars((prev) =>
        original
          ? prev.map((c) => (c.id === calendarId ? { ...original } : c))
          : prev.filter((c) => c.id !== calendarId)
      );
    },
    [baselineCalendars, setCalendars]
  );

  return (
    <SectionWrapper title="Varauskalenterien hallinta">
      <ul className="space-y-4">
        {calendars.map((calendar) => (
          <li key={calendar.id} className="card p-4">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmitRow(calendar);
              }}
              className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_auto_auto]"
              noValidate
            >
              <input
                type="text"
                value={calendar.name}
                onChange={(event) =>
                  handleNameChange(calendar.id, event.target.value)
                }
                className="input-field"
                placeholder="Kalenterin nimi"
                required
              />

              <label className="self-center flex items-center gap-2 md:justify-center text-muted">
                <input
                  type="checkbox"
                  checked={calendar.active}
                  onChange={(event) =>
                    handleActiveChange(calendar.id, event.target.checked)
                  }
                  className="h-5 w-5 align-middle"
                  style={{ accentColor: "var(--primary)" }}
                />
                <span className="leading-none">Aktiivinen</span>
              </label>

              <div className="flex items-center md:justify-end">
                <button type="submit" className="button button-primary">
                  Lähetä muutokset
                </button>
              </div>

              <div className="flex items-center gap-2 md:justify-end">
                <button
                  type="button"
                  onClick={() => resetRow(calendar.id)}
                  className="button button-danger"
                >
                  Palauta
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(calendar.id)}
                  className="button button-danger"
                >
                  Poista
                </button>
              </div>
            </form>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}

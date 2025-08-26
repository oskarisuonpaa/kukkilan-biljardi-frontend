"use client";

import { CalendarItem } from "@/app/lib/definitions";
import SectionWrapper from "@/components/SectionWrapper";

type ManageCalendarsSectionProps = {
  calendars: CalendarItem[];
  setCalendars: React.Dispatch<React.SetStateAction<CalendarItem[]>>;
  baselineCalendars: CalendarItem[];
  setBaselineCalendars: React.Dispatch<React.SetStateAction<CalendarItem[]>>;
};

const ManageCalendarsSection = ({
  calendars,
  setCalendars,
  baselineCalendars,
  setBaselineCalendars,
}: ManageCalendarsSectionProps) => {
  const handleNameChange = (calendarId: number, calendarName: string) =>
    setCalendars((previousCalendars) =>
      previousCalendars.map((calendar) =>
        calendar.id === calendarId
          ? { ...calendar, name: calendarName }
          : calendar
      )
    );

  const handleActiveChange = (calendarId: number, isActive: boolean) =>
    setCalendars((previousCalendars) =>
      previousCalendars.map((calendar) =>
        calendar.id === calendarId
          ? { ...calendar, active: isActive }
          : calendar
      )
    );

  const handleSubmitRow = async (calendar: CalendarItem) => {
    const response = await fetch(`/api/calendars/${calendar.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: calendar.name, active: calendar.active }),
    });
    if (!response.ok) throw new Error("Failed to update calendar");
    const savedCalendar: CalendarItem = await response.json();
    setCalendars((previousCalendars) =>
      previousCalendars.map((calendar) =>
        calendar.id === savedCalendar.id ? savedCalendar : calendar
      )
    );
    setBaselineCalendars((previousBaselineCalendars) =>
      previousBaselineCalendars.some(
        (baselineCalendar) => baselineCalendar.id === savedCalendar.id
      )
        ? previousBaselineCalendars.map((baselineCalendar) =>
            baselineCalendar.id === savedCalendar.id
              ? savedCalendar
              : baselineCalendar
          )
        : [savedCalendar, ...previousBaselineCalendars]
    );
  };

  const handleDelete = async (calendarId: number) => {
    if (!confirm("Poistetaanko tämä kalenteri?")) return;
    const previousCalendars = calendars;
    const previousBaselineCalendars = baselineCalendars;
    setCalendars((previousCalendars) =>
      previousCalendars.filter((calendar) => calendar.id !== calendarId)
    );
    setBaselineCalendars((previousBaselineCalendars) =>
      previousBaselineCalendars.filter((calendar) => calendar.id !== calendarId)
    );
    try {
      const response = await fetch(`/api/calendars/${calendarId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
    } catch (error) {
      setCalendars(previousCalendars);
      setBaselineCalendars(previousBaselineCalendars);
      console.error(error);
    }
  };

  const resetRow = (calendarId: number) => {
    const originalCalendar = baselineCalendars.find(
      (calendar) => calendar.id === calendarId
    );
    setCalendars((previousCalendars) =>
      originalCalendar
        ? previousCalendars.map((calendar) =>
            calendar.id === calendarId ? { ...originalCalendar } : calendar
          )
        : previousCalendars.filter((calendar) => calendar.id !== calendarId)
    );
  };

  return (
    <SectionWrapper title="Varauskalenterien hallinta">
      <ul className="space-y-4">
        {calendars.map((calendar) => (
          <li
            key={calendar.id}
            className="rounded-lg border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-4"
          >
            <form
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmitRow(calendar);
              }}
              className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_auto_auto]"
            >
              <input
                type="text"
                value={calendar.name}
                onChange={(event) =>
                  handleNameChange(calendar.id, event.target.value)
                }
                className="text"
              />
              <label className="self-center flex items-center gap-2 md:justify-center">
                <input
                  type="checkbox"
                  checked={calendar.active}
                  onChange={(event) =>
                    handleActiveChange(calendar.id, event.target.checked)
                  }
                  className="h-5 w-5 align-middle accent-[var(--primary)]"
                />
                <span className="text-[var(--text-secondary)] leading-none">
                  Aktiivinen
                </span>
              </label>
              <div className="flex items-center md:justify-end">
                <button type="submit" className="primary">
                  Lähetä muutokset
                </button>
              </div>
              <div className="flex items-center gap-2 md:justify-end">
                <button
                  type="button"
                  onClick={() => resetRow(calendar.id)}
                  className="danger"
                >
                  Palauta
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(calendar.id)}
                  className="danger"
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
};

export default ManageCalendarsSection;

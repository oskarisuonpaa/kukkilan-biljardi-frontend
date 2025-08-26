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
  const handleNameChange = (calendarId: number, newName: string) =>
    setCalendars((previousCalendars) =>
      previousCalendars.map((calendar) =>
        calendar.id === calendarId ? { ...calendar, name: newName } : calendar
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
    const response = await fetch(
      `http://localhost:3001/api/calendars/${calendar.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: calendar.name, active: calendar.active }),
      }
    );
    const savedCalendar: CalendarItem = await response.json();
    // reflect saved to UI + baseline
    setCalendars((previousCalendars) =>
      previousCalendars.map((c) =>
        c.id === savedCalendar.id ? savedCalendar : c
      )
    );
    setBaselineCalendars((previousBaseline) =>
      previousBaseline.some((b) => b.id === savedCalendar.id)
        ? previousBaseline.map((b) =>
            b.id === savedCalendar.id ? savedCalendar : b
          )
        : [savedCalendar, ...previousBaseline]
    );
  };

  const handleDelete = async (calendarId: number) => {
    if (!confirm("Poistetaanko tämä kalenteri?")) return;

    const previousCalendars = calendars;
    const previousBaseline = baselineCalendars;
    // optimistic remove
    setCalendars((previous) =>
      previous.filter((calendar) => calendar.id !== calendarId)
    );
    setBaselineCalendars((previous) =>
      previous.filter((calendar) => calendar.id !== calendarId)
    );

    try {
      const response = await fetch(
        `http://localhost:3001/api/calendars/${calendarId}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Delete failed");
    } catch (error) {
      setCalendars(previousCalendars);
      setBaselineCalendars(previousBaseline);
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
              {/* name */}
              <input
                type="text"
                value={calendar.name}
                onChange={(event) =>
                  handleNameChange(calendar.id, event.target.value)
                }
                className="text"
              />

              {/* active */}
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

              {/* save */}
              <div className="flex items-center md:justify-end">
                <button type="submit" className="primary">
                  Lähetä muutokset
                </button>
              </div>

              {/* reset & delete */}
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

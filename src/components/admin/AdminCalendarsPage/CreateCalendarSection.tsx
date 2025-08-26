"use client";

import { CalendarItem } from "@/app/lib/definitions";
import SectionWrapper from "@/components/SectionWrapper";
import { useState } from "react";

type CreateCalendarSectionProps = {
  setCalendars: React.Dispatch<React.SetStateAction<CalendarItem[]>>;
  setBaseline: React.Dispatch<React.SetStateAction<CalendarItem[]>>;
};

const CreateCalendarSection = ({
  setCalendars,
  setBaseline,
}: CreateCalendarSectionProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [calendarName, setCalendarName] = useState("");
  const [isActive, setIsActive] = useState(true);

  const handleCreate = async () => {
    if (!calendarName.trim()) return;
    setIsCreating(true);

    // optimistic temporary calendar
    const tempCalendar: CalendarItem = {
      id: -Date.now(),
      name: calendarName.trim(),
      active: isActive,
    };
    setCalendars((prevCalendars) => [tempCalendar, ...prevCalendars]);

    try {
      const response = await fetch("http://localhost:3001/api/calendars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: tempCalendar.name,
          active: tempCalendar.active,
        }),
      });
      const createdCalendar: CalendarItem = await response.json();

      // replace temporary calendar in UI
      setCalendars((prevCalendars) =>
        prevCalendars.map((calendar) =>
          calendar.id === tempCalendar.id ? createdCalendar : calendar
        )
      );
      // add to baseline
      setBaseline((prevBaseline) => [createdCalendar, ...prevBaseline]);

      // reset form
      setCalendarName("");
      setIsActive(true);
    } catch (error) {
      // rollback UI
      setCalendars((prevCalendars) =>
        prevCalendars.filter((calendar) => calendar.id !== tempCalendar.id)
      );
      console.error("Create failed", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <SectionWrapper title="Luo uusi varauskalenteri">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
        <label className="flex flex-col gap-2">
          <span className="text-[var(--text-main)]">Kalenterin nimi</span>
          <input
            value={calendarName}
            onChange={(e) => setCalendarName(e.target.value)}
            placeholder="Esim. Snooker 1"
            className="text"
          />
          <label className="mt-1 flex items-center gap-2 text-[var(--text-secondary)]">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-5 w-5 align-middle accent-[var(--primary)]"
            />
            Aktiivinen
          </label>
        </label>

        <div className="flex items-end gap-2 md:justify-end">
          <button
            type="button"
            disabled={isCreating || !calendarName.trim()}
            onClick={handleCreate}
            className="primary"
          >
            {isCreating ? "Luodaan…" : "Luo kalenteri"}
          </button>
          <button
            type="button"
            onClick={() => {
              setCalendarName("");
              setIsActive(true);
            }}
            className="danger"
          >
            Tyhjennä
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default CreateCalendarSection;

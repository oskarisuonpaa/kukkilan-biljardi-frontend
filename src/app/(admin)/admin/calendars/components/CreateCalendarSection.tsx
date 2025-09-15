"use client";

import { useState } from "react";
import { CalendarItem } from "@/app/lib/definitions";
import SectionWrapper from "@/components/SectionWrapper";

type CreateCalendarSectionProps = {
  setCalendars: React.Dispatch<React.SetStateAction<CalendarItem[]>>;
  setBaseline: React.Dispatch<React.SetStateAction<CalendarItem[]>>;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export default function CreateCalendarSection({
  setCalendars,
  setBaseline,
}: CreateCalendarSectionProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [calendarName, setCalendarName] = useState("");
  const [isActive, setIsActive] = useState(true);

  const canCreate = calendarName.trim().length > 0;

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canCreate) return;

    setIsCreating(true);

    const optimistic: CalendarItem = {
      id: -Date.now(),
      name: calendarName.trim(),
      active: isActive,
    };

    setCalendars((prev) => [optimistic, ...prev]);

    try {
      const response = await fetch(`${API_BASE}/api/calendars`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: optimistic.name,
          active: optimistic.active,
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "Create failed");
        throw new Error(text);
      }

      const created: CalendarItem = await response.json();

      setCalendars((prev) =>
        prev.map((c) => (c.id === optimistic.id ? created : c))
      );
      setBaseline((prev) => [created, ...prev]);

      setCalendarName("");
      setIsActive(true);
    } catch (error) {
      console.error("Create failed", error);
      setCalendars((prev) => prev.filter((c) => c.id !== optimistic.id));
    } finally {
      setIsCreating(false);
    }
  }

  function handleReset() {
    setCalendarName("");
    setIsActive(true);
  }

  return (
    <SectionWrapper title="Luo uusi varauskalenteri">
      <form
        className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]"
        onSubmit={handleCreate}
        noValidate
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm text-muted">Kalenterin nimi</label>
          <input
            value={calendarName}
            onChange={(e) => setCalendarName(e.target.value)}
            placeholder="Esim. Snooker 1"
            className="input-field"
            required
          />

          <label className="mt-1 flex items-center gap-2 text-muted">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-5 w-5 align-middle"
              style={{ accentColor: "var(--primary)" }}
            />
            Aktiivinen
          </label>
        </div>

        <div className="flex items-end gap-2 md:justify-end">
          <button
            type="submit"
            disabled={!canCreate || isCreating}
            aria-disabled={!canCreate || isCreating}
            className="button button-primary"
          >
            {isCreating ? "Luodaan…" : "Luo kalenteri"}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="button button-danger"
          >
            Tyhjennä
          </button>
        </div>
      </form>
    </SectionWrapper>
  );
}

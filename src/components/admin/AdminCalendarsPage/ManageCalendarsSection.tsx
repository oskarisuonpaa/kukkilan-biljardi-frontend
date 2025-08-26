"use client";

import { CalendarItem } from "@/app/lib/definitions";
import SectionWrapper from "@/components/SectionWrapper";

type ManageCalendarsSectionProps = {
  calendars: CalendarItem[];
  setCalendars: React.Dispatch<React.SetStateAction<CalendarItem[]>>;
  baseline: CalendarItem[];
  setBaseline: React.Dispatch<React.SetStateAction<CalendarItem[]>>;
};

const ManageCalendarsSection = ({
  calendars,
  setCalendars,
  baseline,
  setBaseline,
}: ManageCalendarsSectionProps) => {
  const handleNameChange = (id: number, value: string) =>
    setCalendars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: value } : c))
    );

  const handleActiveChange = (id: number, checked: boolean) =>
    setCalendars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: checked } : c))
    );

  const handleSubmitRow = async (item: CalendarItem) => {
    const res = await fetch(`http://localhost:3001/api/calendars/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: item.name, active: item.active }),
    });
    const saved: CalendarItem = await res.json();
    // reflect saved to UI + baseline
    setCalendars((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
    setBaseline((prev) =>
      prev.some((b) => b.id === saved.id)
        ? prev.map((b) => (b.id === saved.id ? saved : b))
        : [saved, ...prev]
    );
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Poistetaanko tämä kalenteri?")) return;

    const prevUI = calendars;
    const prevBaseline = baseline;
    // optimistic remove
    setCalendars((p) => p.filter((c) => c.id !== id));
    setBaseline((p) => p.filter((b) => b.id !== id));

    try {
      const res = await fetch(`http://localhost:3001/api/calendars/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
    } catch (e) {
      setCalendars(prevUI);
      setBaseline(prevBaseline);
      console.error(e);
    }
  };

  const resetRow = (id: number) => {
    const original = baseline.find((b) => b.id === id);
    setCalendars((prev) =>
      original
        ? prev.map((c) => (c.id === id ? { ...original } : c))
        : prev.filter((c) => c.id !== id)
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
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitRow(calendar);
              }}
              className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_auto_auto]"
            >
              {/* name */}
              <input
                type="text"
                value={calendar.name}
                onChange={(e) => handleNameChange(calendar.id, e.target.value)}
                className="text"
              />

              {/* active */}
              <label className="self-center flex items-center gap-2 md:justify-center">
                <input
                  type="checkbox"
                  checked={calendar.active}
                  onChange={(e) =>
                    handleActiveChange(calendar.id, e.target.checked)
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

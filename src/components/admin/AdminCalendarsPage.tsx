"use client";
import { useState } from "react";

type CalendarItem = { id: number; name: string; active: boolean };

const AdminCalendarsPage = ({
  initialCalendars,
}: {
  initialCalendars: CalendarItem[];
}) => {
  const [calendars, setCalendars] = useState(initialCalendars);
  const handleNameChange = (id: number, value: string) =>
    setCalendars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: value } : c))
    );

  const handleActiveChange = (id: number, checked: boolean) =>
    setCalendars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: checked } : c))
    );

  const handleSubmitRow = (item: CalendarItem) => {
    // TODO: replace with API call
    console.log("Submitting calendar changes", item);
  };

  const resetRow = (id: number) =>
    setCalendars((prev) =>
      prev.map((c) =>
        c.id === id ? initialCalendars.find((m) => m.id === id) ?? c : c
      )
    );

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      <section className="rounded-xl border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-6 shadow-sm">
        <header className="mb-6 text-center">
          <h2 className="mb-2 text-xl font-semibold text-[var(--text-main)]">
            Varauskalenterien hallinta
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Muokkaa kalenterien nimiä ja aktiivisuutta.
          </p>
        </header>

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
                className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_auto]"
              >
                {/* Name */}
                <label className="flex flex-col gap-2">
                  <span className="text-[var(--text-main)]">
                    Kalenterin nimi
                  </span>
                  <input
                    type="text"
                    value={calendar.name}
                    onChange={(e) =>
                      handleNameChange(calendar.id, e.target.value)
                    }
                    placeholder="Kalenterin nimi"
                    className="rounded-lg border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-2
                               text-[var(--text-main)] placeholder:text-[var(--text-secondary)]
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]"
                  />
                </label>

                {/* Active */}
                <label className="self-center flex items-center gap-2 md:justify-center">
                  <input
                    id={`active-${calendar.id}`}
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

                {/* Actions */}
                <div className="flex items-center gap-2 md:justify-end">
                  <button
                    type="submit"
                    className="rounded-lg border border-transparent bg-[var(--primary)] px-4 py-2 font-medium text-[var(--text-main)]
                               transition-colors hover:bg-[var(--primary-hover)]
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]
                               focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
                  >
                    Lähetä muutokset
                  </button>

                  <button
                    type="button"
                    onClick={() => resetRow(calendar.id)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 font-medium text-[var(--text-main)]
                               hover:border-[var(--danger)] hover:text-[var(--danger)]
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)]"
                  >
                    Hylkää muutokset
                  </button>
                </div>
              </form>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default AdminCalendarsPage;

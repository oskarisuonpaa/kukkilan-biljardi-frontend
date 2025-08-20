"use client";
import { useState } from "react";

type CalendarItem = { id: number; name: string; active: boolean };

const AdminCalendarsPage = ({
  initialCalendars,
}: {
  initialCalendars: CalendarItem[];
}) => {
  // live UI state
  const [calendars, setCalendars] = useState<CalendarItem[]>(initialCalendars);
  // server-synced baseline we reset back to
  const [baseline, setBaseline] = useState<CalendarItem[]>(initialCalendars);

  // create form state
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newActive, setNewActive] = useState(true);

  // edit handlers
  const handleNameChange = (id: number, value: string) =>
    setCalendars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name: value } : c))
    );

  const handleActiveChange = (id: number, checked: boolean) =>
    setCalendars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: checked } : c))
    );

  // save row (PUT)
  const handleSubmitRow = async (item: CalendarItem) => {
    const res = await fetch(`/api/calendars/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
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

  // CREATE (POST)
  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);

    // optimistic temp
    const temp: CalendarItem = {
      id: -Date.now(),
      name: newName.trim(),
      active: newActive,
    };
    setCalendars((prev) => [temp, ...prev]);

    try {
      const res = await fetch("/api/calendars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: temp.name, active: temp.active }),
      });
      const created: CalendarItem = await res.json();

      // replace temp in UI
      setCalendars((prev) => prev.map((c) => (c.id === temp.id ? created : c)));
      // add to baseline
      setBaseline((prev) => [created, ...prev]);

      // reset form
      setNewName("");
      setNewActive(true);
    } catch (e) {
      // rollback UI
      setCalendars((prev) => prev.filter((c) => c.id !== temp.id));
      console.error("Create failed", e);
    } finally {
      setCreating(false);
    }
  };

  // DELETE (DELETE)
  const handleDelete = async (id: number) => {
    if (!confirm("Poistetaanko tämä kalenteri?")) return;

    const prevUI = calendars;
    const prevBaseline = baseline;
    // optimistic remove
    setCalendars((p) => p.filter((c) => c.id !== id));
    setBaseline((p) => p.filter((b) => b.id !== id));

    try {
      const res = await fetch(`/api/calendars/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
    } catch (e) {
      // rollback both
      setCalendars(prevUI);
      setBaseline(prevBaseline);
      console.error(e);
    }
  };

  // RESET (row): revert to baseline; if none, remove (unsaved new)
  const resetRow = (id: number) => {
    const original = baseline.find((b) => b.id === id);
    setCalendars((prev) =>
      original
        ? prev.map((c) => (c.id === id ? { ...original } : c))
        : prev.filter((c) => c.id !== id)
    );
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      {/* CREATE NEW */}
      <section className="rounded-xl border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-6 shadow-sm">
        <header className="mb-4">
          <h2 className="text-xl font-semibold text-[var(--text-main)]">
            Luo uusi varauskalenteri
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
          <label className="flex flex-col gap-2">
            <span className="text-[var(--text-main)]">Kalenterin nimi</span>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Esim. Snooker 1"
              className="rounded-lg border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-2
                         text-[var(--text-main)] placeholder:text-[var(--text-secondary)]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]"
            />
            <label className="mt-1 flex items-center gap-2 text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={newActive}
                onChange={(e) => setNewActive(e.target.checked)}
                className="h-5 w-5 align-middle accent-[var(--primary)]"
              />
              Aktiivinen
            </label>
          </label>

          <div className="flex items-end gap-2 md:justify-end">
            <button
              type="button"
              disabled={creating || !newName.trim()}
              onClick={handleCreate}
              className="rounded-lg border border-transparent bg-[var(--primary)] px-4 py-2 font-medium text-[var(--text-main)]
                         transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-60
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]
                         focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
            >
              {creating ? "Luodaan…" : "Luo kalenteri"}
            </button>
            <button
              type="button"
              onClick={() => {
                setNewName("");
                setNewActive(true);
              }}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 font-medium text-[var(--text-main)]
                         hover:border-[var(--secondary)] hover:text-[var(--secondary)]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]"
            >
              Tyhjennä
            </button>
          </div>
        </div>
      </section>

      {/* EDIT / DELETE / RESET */}
      <section className="rounded-xl border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-6 shadow-sm">
        <header className="mb-6 text-center">
          <h2 className="mb-2 text-xl font-semibold text-[var(--text-main)]">
            Varauskalenterien hallinta
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Muokkaa kalenterien nimiä ja aktiivisuutta, poista tai palauta
            muutokset.
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
                className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_auto_auto]"
              >
                {/* name */}
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
                    className="rounded-lg border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-2
                               text-[var(--text-main)] placeholder:text-[var(--text-secondary)]
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]"
                  />
                </label>

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
                  <button
                    type="submit"
                    className="rounded-lg border border-transparent bg-[var(--primary)] px-4 py-2 font-medium text-[var(--text-main)]
                               transition-colors hover:bg-[var(--primary-hover)]
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]
                               focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
                  >
                    Lähetä muutokset
                  </button>
                </div>

                {/* reset & delete */}
                <div className="flex items-center gap-2 md:justify-end">
                  <button
                    type="button"
                    onClick={() => resetRow(calendar.id)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 font-medium text-[var(--text-main)]
                               hover:border-[var(--secondary)] hover:text-[var(--secondary)]
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]"
                  >
                    Reset
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(calendar.id)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 font-medium text-[var(--text-main)]
                               hover:border-[var(--danger)] hover:text-[var(--danger)]
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)]"
                  >
                    Poista
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

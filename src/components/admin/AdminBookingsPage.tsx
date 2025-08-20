"use client";

import { useMemo, useState } from "react";

type CalendarItem = { id: number; name: string; active: boolean };
type BookingItem = {
  id: number;
  calendar_id: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  start: string; // ISO string
  end: string; // ISO string
};

const fmtDay = (d: Date) =>
  new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);

const fmtTime = (d: Date) =>
  new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);

const toDateKey = (d: Date) => d.toISOString().slice(0, 10);

export default function AdminBookingsPage({
  calendars,
  initialBookings,
}: {
  calendars: CalendarItem[];
  initialBookings: BookingItem[];
}) {
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);
  const [selectedCalendar, setSelectedCalendar] = useState<number>(
    calendars[0]?.id ?? 0
  );
  const [query, setQuery] = useState("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const base = bookings.filter((b) => b.calendar_id === selectedCalendar);

    const searched = q
      ? base.filter((b) =>
          [b.name, b.email, b.phone, b.notes]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))
        )
      : base;

    const sorted = [...searched].sort((a, b) => {
      const da = new Date(a.start).getTime();
      const db = new Date(b.start).getTime();
      return sortDir === "asc" ? da - db : db - da;
    });

    const groups = sorted.reduce((acc, b) => {
      const key = toDateKey(new Date(b.start));
      (acc[key] ||= []).push(b);
      return acc;
    }, {} as Record<string, BookingItem[]>);

    return { groups, count: sorted.length };
  }, [bookings, selectedCalendar, query, sortDir]);

  // DELETE booking (optimistic)
  const handleDeleteBooking = async (id: number) => {
    if (!confirm("Poistetaanko tämä varaus?")) return;

    const prev = bookings;
    // optimistic remove
    setBookings((p) => p.filter((b) => b.id !== id));

    try {
      const res = await fetch(`http://localhost:3001/api/bookings/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
    } catch (e) {
      // rollback
      console.error(e);
      setBookings(prev);
      alert("Poisto epäonnistui. Yritä uudelleen.");
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      <section className="rounded-xl border border-[var(--border)]/60 bg-[var(--bg-secondary)] shadow-sm">
        <header className="flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-main)]">
              Varausten hallinta
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Näytä ja hae varauksia kalentereittain.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-muted)]">
                Kalenteri
              </span>
              <select
                name="calendar"
                id="calendar"
                className="rounded-lg border px-3 py-2 bg-[var(--bg)]"
                value={selectedCalendar}
                onChange={(e) => setSelectedCalendar(Number(e.target.value))}
              >
                {calendars.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {!c.active ? " (inactive)" : ""}
                  </option>
                ))}
              </select>
            </label>

            <input
              type="search"
              placeholder="Haku: nimi, email, puh., muistiinpanot"
              className="w-full sm:w-72 rounded-lg border px-3 py-2 bg-[var(--bg)]"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button
              onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
              className="rounded-lg border px-3 py-2 text-sm hover:bg-[var(--bg)]"
              aria-label="Toggle sort direction"
              title="Lajittele alkamisajan mukaan"
            >
              Sort:{" "}
              {sortDir === "asc" ? "Earliest → Latest" : "Latest → Earliest"}
            </button>
          </div>
        </header>

        <div className="px-6 pb-6">
          <div className="mb-3 text-sm text-[var(--text-muted)]">
            {filtered.count} booking{filtered.count === 1 ? "" : "s"} in “
            {calendars.find((c) => c.id === selectedCalendar)?.name ?? "—"}”
          </div>

          {filtered.count === 0 && (
            <div className="rounded-xl border border-dashed p-10 text-center text-[var(--text-muted)]">
              Ei varauksia valitussa kalenterissa (tai hakuehdoilla).
            </div>
          )}

          <div className="space-y-8">
            {Object.entries(filtered.groups).map(([dayKey, items]) => {
              const day = new Date(dayKey + "T00:00:00");
              return (
                <section key={dayKey}>
                  <h3 className="mb-3 text-sm font-semibold tracking-wide text-[var(--text-muted)]">
                    {fmtDay(day)} • {items.length} item
                    {items.length === 1 ? "" : "s"}
                  </h3>

                  {/* Table on desktop */}
                  <div className="hidden md:block overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                      <thead className="bg-[var(--bg)]">
                        <tr className="[&>th]:px-4 [&>th]:py-3 text-left">
                          <th>Time</th>
                          <th>Name</th>
                          <th>Contact</th>
                          <th>Notes</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="[&>tr:not(:last-child)]:border-b">
                        {items.map((b) => {
                          const s = new Date(b.start);
                          const e = new Date(b.end);
                          return (
                            <tr key={b.id} className="[&>td]:px-4 [&>td]:py-3">
                              <td className="whitespace-nowrap">
                                {fmtTime(s)} – {fmtTime(e)}
                              </td>
                              <td className="font-medium">{b.name}</td>
                              <td className="space-y-1">
                                <div>
                                  <a
                                    className="underline"
                                    href={`mailto:${b.email}`}
                                  >
                                    {b.email}
                                  </a>
                                </div>
                                {b.phone && (
                                  <div>
                                    <a
                                      className="underline"
                                      href={`tel:${b.phone}`}
                                    >
                                      {b.phone}
                                    </a>
                                  </div>
                                )}
                              </td>
                              <td className="max-w-[28rem]">
                                {b.notes ? (
                                  <span title={b.notes}>{b.notes}</span>
                                ) : (
                                  <span className="text-[var(--text-muted)]">
                                    —
                                  </span>
                                )}
                              </td>
                              <td className="text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteBooking(b.id)}
                                  className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 font-medium
                                             hover:border-[var(--danger)] hover:text-[var(--danger)]
                                             focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)]"
                                >
                                  Poista
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Cards on mobile */}
                  <div className="md:hidden space-y-3">
                    {items.map((b) => {
                      const s = new Date(b.start);
                      const e = new Date(b.end);
                      return (
                        <article key={b.id} className="rounded-xl border p-4">
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-[var(--text-muted)]">
                              {fmtTime(s)} – {fmtTime(e)}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteBooking(b.id)}
                              className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-1.5 text-sm font-medium
                                         hover:border-[var(--danger)] hover:text-[var(--danger)]
                                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)]"
                            >
                              Poista
                            </button>
                          </div>
                          <div className="mt-1 font-medium">{b.name}</div>
                          <div className="mt-2 text-sm">
                            <div>
                              <a
                                className="underline"
                                href={`mailto:${b.email}`}
                              >
                                {b.email}
                              </a>
                            </div>
                            {b.phone && (
                              <div>
                                <a
                                  className="underline"
                                  href={`tel:${b.phone}`}
                                >
                                  {b.phone}
                                </a>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 text-sm">
                            {b.notes ? (
                              b.notes
                            ) : (
                              <span className="text-[var(--text-muted)]">
                                No notes
                              </span>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

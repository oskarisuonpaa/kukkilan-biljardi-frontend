"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import SlotCalendar from "@/components/SlotCalendar";
import { SlotEvent } from "../SlotCalendar/types";

type CalendarItem = { id: number; name: string; active: boolean };
type BookingItem = {
  id: number;
  calendar_id: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  start: string;
  end: string;
};

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

  // NEW: calendar date + selected range from calendar
  const [date, setDate] = useState(new Date());
  const [pendingRange, setPendingRange] = useState<{
    start: string;
    end: string;
  } | null>(null);

  // Create form (no start/end inputs anymore—picked from calendar)
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newNotes, setNewNotes] = useState("");

  useEffect(() => {
    setPendingRange(null);
  }, [date, selectedCalendar]);

  const sameDay = useCallback(
    (iso: string) => new Date(iso).toDateString() === date.toDateString(),
    [date]
  );

  // Calendar events = booked ranges for selected day+calendar
  const dayEvents: SlotEvent[] = useMemo(
    () =>
      bookings
        .filter((b) => b.calendar_id === selectedCalendar && sameDay(b.start))
        .map((b) => ({ id: b.id, start: b.start, end: b.end, title: b.name })),
    [bookings, selectedCalendar, sameDay]
  );

  // List section (search/sort)
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
      const da = +new Date(a.start);
      const db = +new Date(b.start);
      return sortDir === "asc" ? da - db : db - da;
    });
    const byDate = sorted.reduce((acc, b) => {
      const key = new Date(b.start).toISOString().slice(0, 10);
      (acc[key] ||= []).push(b);
      return acc;
    }, {} as Record<string, BookingItem[]>);
    return { groups: byDate, count: sorted.length };
  }, [bookings, selectedCalendar, query, sortDir]);

  // DELETE booking (optimistic)
  const handleDeleteBooking = async (id: number) => {
    if (!confirm("Poistetaanko tämä varaus?")) return;
    const prev = bookings;
    setBookings((p) => p.filter((b) => b.id !== id));
    try {
      const res = await fetch(`http://localhost:3001/api/bookings/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
    } catch (e) {
      console.error(e);
      setBookings(prev);
      alert("Poisto epäonnistui. Yritä uudelleen.");
    }
  };

  // CREATE booking from calendar selection
  const handleCreateBooking = async () => {
    if (
      !pendingRange ||
      !newName.trim() ||
      !newEmail.trim() ||
      !newPhone.trim()
    ) {
      alert("Valitse kalenterista aika ja täytä pakolliset kentät.");
      return;
    }
    setCreating(true);
    const temp: BookingItem = {
      id: -Date.now(),
      calendar_id: selectedCalendar,
      name: newName.trim(),
      email: newEmail.trim(),
      phone: newPhone.trim(),
      notes: newNotes.trim() || undefined,
      start: pendingRange.start,
      end: pendingRange.end,
    };
    setBookings((prev) => [temp, ...prev]);

    try {
      const res = await fetch("http://localhost:3001/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(temp),
      });
      if (!res.ok) throw new Error("Create failed");
      const created: BookingItem = await res.json();
      setBookings((prev) => prev.map((b) => (b.id === temp.id ? created : b)));
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewNotes("");
      setPendingRange(null);
    } catch (e) {
      console.error(e);
      setBookings((prev) => prev.filter((b) => b.id !== temp.id));
      alert("Varauksen luonti epäonnistui. Yritä uudelleen.");
    } finally {
      setCreating(false);
    }
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

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      {/* CREATE with calendar */}
      <section className="rounded-xl border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold text-[var(--text-main)]">
          Luo uusi varaus
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <SlotCalendar
              date={date}
              setDate={setDate}
              startHour={8}
              endHour={22}
              slotMinutes={30}
              events={dayEvents}
              onSelect={setPendingRange}
              selectedRange={pendingRange}
            />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2">
              <span className="text-sm text-[var(--text-muted)]">
                Kalenteri
              </span>
              <select
                className="rounded-lg
  border border-[var(--border)]/60 bg-[var(--bg-secondary)] px-4 py-2 font-medium text-[var(--text-main)] focus:outline-none
                           "
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

            {/* ✅ Selected time ABOVE the name field */}
            <div className="rounded-lg border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-2">
              <div className="mb-1 font-medium">Valittu aika</div>
              {pendingRange ? (
                <div>
                  {new Date(pendingRange.start).toLocaleString()} –{" "}
                  {new Date(pendingRange.end).toLocaleString()}
                </div>
              ) : (
                <div className="text-[var(--text-secondary)]">Ei valintaa</div>
              )}
            </div>

            {/* Name, then the rest */}
            <input
              className="text"
              placeholder="Nimi *"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className="text"
              placeholder="Sähköposti *"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              className="text"
              placeholder="Puhelin *"
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
            />
            <textarea
              placeholder="Muistiinpanot"
              value={newNotes}
              onChange={(e) => setNewNotes(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={handleCreateBooking}
                disabled={
                  creating ||
                  !pendingRange ||
                  !newName.trim() ||
                  !newEmail.trim() ||
                  !newPhone.trim()
                }
                className="primary"
              >
                {creating ? "Luodaan…" : "Luo varaus"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPendingRange(null);
                  setNewName("");
                  setNewEmail("");
                  setNewPhone("");
                  setNewNotes("");
                }}
                className="danger"
              >
                Tyhjennä
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LIST + search/sort + delete (unchanged except no IDs shown) */}
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

          {Object.entries(filtered.groups).map(([dayKey, items]) => {
            const day = new Date(dayKey + "T00:00:00");
            return (
              <section key={dayKey} className="space-y-3 mb-8">
                <h3 className="text-sm font-semibold tracking-wide text-[var(--text-muted)]">
                  {fmtDay(day)} • {items.length} item
                  {items.length === 1 ? "" : "s"}
                </h3>

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
                              {b.notes ?? (
                                <span className="text-[var(--text-muted)]">
                                  —
                                </span>
                              )}
                            </td>
                            <td className="text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteBooking(b.id)}
                                className="danger"
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

                {/* Mobile cards */}
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
                            className="danger"
                          >
                            Poista
                          </button>
                        </div>
                        <div className="mt-1 font-medium">{b.name}</div>
                        <div className="mt-2 text-sm">
                          <div>
                            <a className="underline" href={`mailto:${b.email}`}>
                              {b.email}
                            </a>
                          </div>
                          {b.phone && (
                            <div>
                              <a className="underline" href={`tel:${b.phone}`}>
                                {b.phone}
                              </a>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-sm">
                          {b.notes ?? (
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
      </section>
    </main>
  );
}

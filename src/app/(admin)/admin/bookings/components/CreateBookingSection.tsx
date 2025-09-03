"use client";

import { BookingItem, CalendarItem } from "@/app/lib/definitions";
import SectionWrapper from "@/components/SectionWrapper";
import SlotCalendar from "@/components/SlotCalendar";
import { SlotEvent } from "@/components/SlotCalendar/types";
import { useCallback, useMemo, useState } from "react";

type CreateBookingSectionProps = {
  calendars: CalendarItem[];
  bookings: BookingItem[];
  setBookings: (
    bookings: BookingItem[] | ((prev: BookingItem[]) => BookingItem[])
  ) => void;
};

const CreateBookingSection = ({
  calendars,
  bookings,
  setBookings,
}: CreateBookingSectionProps) => {
  const [selectedCalendar, setSelectedCalendar] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [pendingRange, setPendingRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const canCreate = Boolean(
    pendingRange && newName.trim() && newEmail.trim() && newPhone.trim()
  );

  const sameDay = useCallback(
    (iso: string) => new Date(iso).toDateString() === date.toDateString(),
    [date]
  );

  const dayEvents: SlotEvent[] = useMemo(
    () =>
      bookings
        .filter((b) => b.calendar_id === selectedCalendar && sameDay(b.start))
        .map((b) => ({ id: b.id, start: b.start, end: b.end, title: b.name })),
    [bookings, selectedCalendar, sameDay]
  );

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
    setBookings((prev: BookingItem[]) => [temp, ...prev]);

    try {
      const res = await fetch("http://localhost:3001/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(temp),
      });
      if (!res.ok) throw new Error("Create failed");
      const created: BookingItem = await res.json();
      setBookings((prev: BookingItem[]) =>
        prev.map((b) => (b.id === temp.id ? created : b))
      );
      setNewName("");
      setNewEmail("");
      setNewPhone("");
      setNewNotes("");
      setPendingRange(null);
    } catch (e) {
      console.error(e);
      setBookings((prev: BookingItem[]) =>
        prev.filter((b) => b.id !== temp.id)
      );
      alert("Varauksen luonti epäonnistui. Yritä uudelleen.");
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setNewName("");
    setNewEmail("");
    setNewPhone("");
    setNewNotes("");
    setPendingRange(null);
  };

  return (
    <SectionWrapper title="Luo uusi varaus">
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
            <span className="text-sm text-[var(--text-muted)]">Kalenteri</span>
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
              disabled={!canCreate}
              className="primary"
            >
              {creating ? "Luodaan…" : "Luo varaus"}
            </button>
            <button type="button" onClick={resetForm} className="danger">
              Tyhjennä
            </button>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default CreateBookingSection;

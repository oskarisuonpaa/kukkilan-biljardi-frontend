"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import SlotCalendar from "@/components/SlotCalendar";
import type { SlotEvent } from "@/components/SlotCalendar/types";

type ReserveTableDetailPageProps = {
  params: { slug: string };
};

type PendingRange = { start: string; end: string } | null;

function humanizeSlug(slug: string): string {
  try {
    return decodeURIComponent(slug).replace(/-/g, " ");
  } catch {
    return slug.replace(/-/g, " ");
  }
}

function formatFinnishDateTime(iso: string): string {
  return new Date(iso).toLocaleString("fi-FI");
}

function formatRangeLabel(range: PendingRange): string {
  if (!range) return "";
  return `${formatFinnishDateTime(range.start)} – ${formatFinnishDateTime(
    range.end
  )}`;
}

export default function ReserveTableDetailPage({
  params,
}: ReserveTableDetailPageProps) {
  const tableSlug = params.slug;
  const tableDisplayName = humanizeSlug(tableSlug);

  // Calendar state
  const [date, setDate] = useState<Date>(new Date());
  const [selectedRange, setSelectedRange] = useState<PendingRange>(null);

  // Form state
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [details, setDetails] = useState<string>("");

  const [submitting, setSubmitting] = useState<boolean>(false);

  const canSubmit = Boolean(
    selectedRange && name.trim() && email.trim() && phone.trim()
  );

  // Existing bookings for the selected day (replace with real data when wired)
  const dayEvents: SlotEvent[] = useMemo<SlotEvent[]>(() => [], []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || !selectedRange) return;

    setSubmitting(true);

    // Fallback calendar id is 0 until wired to real data.
    const payload = {
      calendar_id: Number(tableSlug) || 0,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      notes: details.trim() || undefined,
      start: selectedRange.start,
      end: selectedRange.end,
    };

    try {
      // Prefer a Next.js API route that proxies to the backend.
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Request failed ${response.status}`);
      }

      // Success UX — basic for now:
      setName("");
      setEmail("");
      setPhone("");
      setDetails("");
      setSelectedRange(null);
      alert("Varaus tallennettu!");
    } catch (error) {
      console.error(error);
      alert("Varauksen tallennus epäonnistui. Yritä uudelleen.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main id="main" className="mx-auto max-w-5xl px-6 py-10">
      <section className="card p-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-[var(--text-main)]">
            Varaa pöytä:{" "}
            <span className="text-[var(--secondary)]">{tableDisplayName}</span>
          </h1>
          <p className="text-muted">
            Valitse kalenterista sopiva aika ja täytä yhteystietosi.{" "}
            <Link
              href="/privacy"
              className="underline text-[var(--secondary)] hover:text-[var(--secondary-hover)]"
            >
              Tietosuojaseloste
            </Link>
            .
          </p>
        </header>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Calendar */}
          <div id="calendar" className="md:w-1/2">
            <SlotCalendar
              date={date}
              setDate={setDate}
              startHour={8}
              endHour={22}
              slotMinutes={30}
              events={dayEvents}
              onSelect={setSelectedRange}
              selectedRange={selectedRange}
            />
          </div>

          {/* Reservation form */}
          <div className="md:flex-1">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Selected time (read-only) */}
              <div className="flex flex-col gap-2">
                <label className="text-[var(--text-main)]" htmlFor="timeslots">
                  Valittu aika
                </label>
                <input
                  id="timeslots"
                  name="timeslots"
                  type="text"
                  readOnly
                  aria-readonly="true"
                  placeholder="Valitse kalenterista aika"
                  value={formatRangeLabel(selectedRange)}
                  className="input-field"
                />
                <div className="flex items-center gap-3 text-sm">
                  <a
                    href="#calendar"
                    className="underline text-[var(--secondary)] hover:text-[var(--secondary-hover)]"
                  >
                    Valitse kalenterista
                  </a>
                  <span className="text-muted">
                    Aika ilmestyy kenttään valinnan jälkeen.
                  </span>
                </div>
              </div>

              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[var(--text-main)]" htmlFor="name">
                  Nimi *
                </label>
                <input
                  className="input-field"
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Etunimi Sukunimi"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-2">
                <label className="text-[var(--text-main)]" htmlFor="email">
                  Sähköposti *
                </label>
                <input
                  className="input-field"
                  type="email"
                  id="email"
                  name="email"
                  placeholder="sahkoposti@esimerkki.fi"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <label className="text-[var(--text-main)]" htmlFor="phone">
                  Puhelin *
                </label>
                <input
                  className="input-field"
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="040 123 4567"
                  required
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              {/* Details */}
              <div className="flex flex-col gap-2">
                <label className="text-[var(--text-main)]" htmlFor="details">
                  Lisätiedot
                </label>
                <textarea
                  className="input-field min-h-28"
                  id="details"
                  name="details"
                  placeholder="Pelaajien määrä, toiveet, lisätiedot"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="button button-primary w-full"
                  disabled={!canSubmit || submitting}
                >
                  {submitting ? "Lähetetään…" : "Varaa"}
                </button>

                <p className="mt-3 text-sm text-muted">
                  Varaamalla hyväksyt{" "}
                  <Link
                    href="/privacy"
                    className="underline text-[var(--secondary)] hover:text-[var(--secondary-hover)]"
                  >
                    tietosuojakäytäntömme
                  </Link>
                  .
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}

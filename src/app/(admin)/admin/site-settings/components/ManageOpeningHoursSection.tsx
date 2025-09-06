"use client";

import { useMemo, useState } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import type { OpeningDay, OpeningInterval } from "@/app/lib/definitions";
import { saveOpeningDays } from "@/app/lib/openingHoursApi";

type Props = {
  initialDays: OpeningDay[]; // supply from server page loader
};

const WEEKDAYS_FI = [
  "Sunnuntai",
  "Maanantai",
  "Tiistai",
  "Keskiviikko",
  "Torstai",
  "Perjantai",
  "Lauantai",
];

function makeEmptyDay(weekday: number): OpeningDay {
  return { weekday, closed: true, intervals: [] };
}

function normalizeDays(input: OpeningDay[]): OpeningDay[] {
  const byDay = new Map(input.map((d) => [d.weekday, d]));
  return Array.from({ length: 7 }, (_, w) => {
    const d = byDay.get(w);
    return d ? { ...d, intervals: d.intervals ?? [] } : makeEmptyDay(w);
  });
}

function isValidHHMM(v: string): boolean {
  return (
    /^\d{2}:\d{2}$/.test(v) &&
    Number(v.slice(0, 2)) < 24 &&
    Number(v.slice(3, 5)) < 60
  );
}

function cmpHHMM(a: string, b: string): number {
  return a.localeCompare(b);
}

function intervalValid(x: OpeningInterval): boolean {
  return (
    isValidHHMM(x.start) && isValidHHMM(x.end) && cmpHHMM(x.start, x.end) < 0
  );
}

export default function ManageOpeningHoursSection({ initialDays }: Props) {
  const [days, setDays] = useState<OpeningDay[]>(normalizeDays(initialDays));
  const [saving, setSaving] = useState(false);

  const errors = useMemo(() => {
    const errs = new Map<number, string>();
    days.forEach((d) => {
      if (!d.closed) {
        if (d.intervals.length === 0) {
          errs.set(
            d.weekday,
            "Lisää vähintään yksi aikaväli tai merkitse päivä suljetuksi."
          );
          return;
        }
        const bad = d.intervals.find((iv) => !intervalValid(iv));
        if (bad) {
          errs.set(
            d.weekday,
            "Aikavälit eivät ole kelvollisia (muoto HH:MM ja alku < loppu)."
          );
          return;
        }
        const sorted = [...d.intervals].sort((a, b) =>
          cmpHHMM(a.start, b.start)
        );
        for (let i = 1; i < sorted.length; i++) {
          if (cmpHHMM(sorted[i - 1].end, sorted[i].start) > 0) {
            errs.set(d.weekday, "Aikavälit menevät päällekkäin.");
            break;
          }
        }
      }
    });
    return errs;
  }, [days]);

  const canSave = errors.size === 0;

  function toggleClosed(w: number, closed: boolean) {
    setDays((prev) =>
      prev.map((d) =>
        d.weekday === w
          ? {
              ...d,
              closed,
              intervals: closed
                ? []
                : d.intervals.length
                ? d.intervals
                : [{ start: "08:00", end: "22:00" }],
            }
          : d
      )
    );
  }

  function addInterval(w: number) {
    setDays((prev) =>
      prev.map((d) =>
        d.weekday === w
          ? {
              ...d,
              closed: false,
              intervals: [...d.intervals, { start: "08:00", end: "22:00" }],
            }
          : d
      )
    );
  }

  function updateInterval(
    w: number,
    i: number,
    patch: Partial<OpeningInterval>
  ) {
    setDays((prev) =>
      prev.map((d) =>
        d.weekday === w
          ? {
              ...d,
              intervals: d.intervals.map((iv, idx) =>
                idx === i ? { ...iv, ...patch } : iv
              ),
            }
          : d
      )
    );
  }

  function removeInterval(w: number, i: number) {
    setDays((prev) =>
      prev.map((d) =>
        d.weekday === w
          ? { ...d, intervals: d.intervals.filter((_, idx) => idx !== i) }
          : d
      )
    );
  }

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    try {
      const saved = await saveOpeningDays(days);
      setDays(normalizeDays(saved));
    } catch (e) {
      console.error(e);
      alert("Tallennus epäonnistui. Yritä uudelleen.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <SectionWrapper title="Aukioloajat">
      <div className="space-y-4">
        {days.map((d) => (
          <div key={d.weekday} className="card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="font-medium">{WEEKDAYS_FI[d.weekday]}</div>
              <label className="flex items-center gap-2 text-muted">
                <input
                  type="checkbox"
                  checked={d.closed}
                  onChange={(e) => toggleClosed(d.weekday, e.target.checked)}
                  className="h-5 w-5"
                  style={{ accentColor: "var(--primary)" }}
                />
                <span>Kiinni koko päivän</span>
              </label>
            </div>

            {!d.closed && (
              <div className="mt-3 space-y-2">
                {d.intervals.map((iv, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[auto_1fr_auto_1fr_auto_auto] items-center gap-2"
                  >
                    <span className="text-sm text-muted">Aukeaa</span>
                    <input
                      className="input-field"
                      placeholder="HH:MM"
                      value={iv.start}
                      onChange={(e) =>
                        updateInterval(d.weekday, i, { start: e.target.value })
                      }
                    />
                    <span className="mx-1 text-sm text-muted">–</span>
                    <input
                      className="input-field"
                      placeholder="HH:MM"
                      value={iv.end}
                      onChange={(e) =>
                        updateInterval(d.weekday, i, { end: e.target.value })
                      }
                    />
                    <button
                      type="button"
                      className="button button-danger"
                      onClick={() => removeInterval(d.weekday, i)}
                    >
                      Poista
                    </button>
                    {i === d.intervals.length - 1 && (
                      <button
                        type="button"
                        className="button button-primary"
                        onClick={() => addInterval(d.weekday)}
                      >
                        Lisää väli
                      </button>
                    )}
                  </div>
                ))}

                {d.intervals.length === 0 && (
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() => addInterval(d.weekday)}
                  >
                    Lisää aikaväli
                  </button>
                )}
              </div>
            )}

            {errors.has(d.weekday) && (
              <p className="mt-2 text-xs" style={{ color: "var(--danger)" }}>
                {errors.get(d.weekday)}
              </p>
            )}
          </div>
        ))}

        <div className="flex justify-end">
          <button
            type="button"
            className="button button-primary"
            onClick={handleSave}
            disabled={!canSave || saving}
            aria-disabled={!canSave || saving}
          >
            {saving ? "Tallennetaan…" : "Tallenna aukioloajat"}
          </button>
        </div>
      </div>
    </SectionWrapper>
  );
}

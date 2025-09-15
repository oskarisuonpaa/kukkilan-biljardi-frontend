// src/app/(admin)/admin/site-settings/components/ManageOpeningHoursSection.tsx
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { WEEKDAYS_FI, type OpeningHourResponse } from "@/app/lib/definitions";
import {
  listOpeningHours,
  upsertOpeningHour,
  deleteOpeningHour,
} from "@/app/lib/openingHoursApi";

/**
 * Internal representation for one weekday row in the editor.
 * If hasHours is false, that weekday is considered "closed" (no record in backend).
 */
type EditableDay = {
  weekday: number; // 1 … 7
  hasHours: boolean; // true if the backend holds hours for this weekday
  opensAt: string; // "HH:MM" (ui only, will be sent as "HH:MM:SS")
  closesAt: string; // "HH:MM"
  isSaving: boolean;
  errorMessage: string | null;
};

function toUiTime(hms: string): string {
  // Convert "HH:MM:SS" -> "HH:MM"
  const [hh = "09", mm = "00"] = hms.split(":");
  return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
}

function toApiTime(hm: string): string {
  // Convert "HH:MM" -> "HH:MM:00"
  const [hh = "09", mm = "00"] = hm.split(":");
  return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}:00`;
}

function makeEmptyDay(weekday: number): EditableDay {
  return {
    weekday,
    hasHours: false,
    opensAt: "09:00",
    closesAt: "17:00",
    isSaving: false,
    errorMessage: null,
  };
}

export default function ManageOpeningHoursSection() {
  const [days, setDays] = useState<EditableDay[]>(
    Array.from({ length: 7 }, (_, idx) => makeEmptyDay(idx + 1))
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Load once on mount.
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const existing = await listOpeningHours();
        if (!mounted) return;
        setDays((prev) => {
          const map = new Map<number, OpeningHourResponse>();
          existing.forEach((r) => map.set(r.weekday, r));
          return prev.map((d) => {
            const row = map.get(d.weekday);
            if (!row) return makeEmptyDay(d.weekday); // closed
            return {
              weekday: d.weekday,
              hasHours: true,
              opensAt: toUiTime(row.opens_at),
              closesAt: toUiTime(row.closes_at),
              isSaving: false,
              errorMessage: null,
            };
          });
        });
        setLoadError(null);
      } catch (err) {
        setLoadError((err as Error).message || "Failed to load opening hours");
      } finally {
        setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleToggleClosed = (weekday: number, closed: boolean): void => {
    setDays((prev) =>
      prev.map((d) => (d.weekday === weekday ? { ...d, hasHours: !closed } : d))
    );
  };

  const handleTimeChange = (
    weekday: number,
    field: "opensAt" | "closesAt",
    value: string
  ): void => {
    setDays((prev) =>
      prev.map((d) =>
        d.weekday === weekday ? ({ ...d, [field]: value } as EditableDay) : d
      )
    );
  };

  const validateTimes = (opensAt: string, closesAt: string): string | null => {
    // Very small guard: both present and opensAt < closesAt lexicographically in "HH:MM"
    if (!opensAt || !closesAt)
      return "Both opening and closing times are required.";
    if (opensAt >= closesAt)
      return "Opening time must be earlier than closing time.";
    return null;
    // If you later need overnight hours (e.g., 22:00–02:00), adapt this check accordingly.
  };

  const handleSaveOne = async (day: EditableDay): Promise<void> => {
    setDays((prev) =>
      prev.map((d) =>
        d.weekday === day.weekday
          ? { ...d, isSaving: true, errorMessage: null }
          : d
      )
    );
    try {
      if (!day.hasHours) {
        // No hours means "closed" => ensure backend entry is deleted.
        await deleteOpeningHour(day.weekday);
      } else {
        const error = validateTimes(day.opensAt, day.closesAt);
        if (error) throw new Error(error);
        await upsertOpeningHour(day.weekday, {
          opens_at: toApiTime(day.opensAt),
          closes_at: toApiTime(day.closesAt),
        });
      }
      setDays((prev) =>
        prev.map((d) =>
          d.weekday === day.weekday
            ? { ...d, isSaving: false, errorMessage: null }
            : d
        )
      );
    } catch (err) {
      setDays((prev) =>
        prev.map((d) =>
          d.weekday === day.weekday
            ? { ...d, isSaving: false, errorMessage: (err as Error).message }
            : d
        )
      );
    }
  };

  const handleSaveAll = (): void => {
    startTransition(async () => {
      for (const day of days) {
        // Save sequentially to keep errors localized per day row.
        await handleSaveOne(day);
      }
    });
  };

  const isAnySaving = useMemo(
    () => days.some((d) => d.isSaving) || isPending,
    [days, isPending]
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Regular Opening Hours</h2>
        <button
          className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-50"
          onClick={handleSaveAll}
          disabled={isLoading || isAnySaving}
          aria-disabled={isLoading || isAnySaving}
        >
          Save All Changes
        </button>
      </div>

      {isLoading ? (
        <div className="text-muted">Loading opening hours…</div>
      ) : loadError ? (
        <div className="text-red-600">Failed to load: {loadError}</div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {days.map((d) => {
            const isClosed = !d.hasHours;
            return (
              <div key={d.weekday} className="rounded-2xl border p-4 shadow-sm">
                <div className="mb-2 flex items-center justify-between">
                  <div className="font-medium">{WEEKDAYS_FI[d.weekday]}</div>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={isClosed}
                      onChange={(e) =>
                        handleToggleClosed(d.weekday, e.target.checked)
                      }
                    />
                    Closed
                  </label>
                </div>

                <div className="grid grid-cols-2 items-end gap-3">
                  <label className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Opens at
                    </span>
                    <input
                      type="time"
                      value={d.opensAt}
                      onChange={(e) =>
                        handleTimeChange(d.weekday, "opensAt", e.target.value)
                      }
                      disabled={isClosed}
                      className="rounded-xl border px-3 py-2 disabled:opacity-50"
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Closes at
                    </span>
                    <input
                      type="time"
                      value={d.closesAt}
                      onChange={(e) =>
                        handleTimeChange(d.weekday, "closesAt", e.target.value)
                      }
                      disabled={isClosed}
                      className="rounded-xl border px-3 py-2 disabled:opacity-50"
                    />
                  </label>
                </div>

                {d.errorMessage ? (
                  <div className="mt-2 text-sm text-red-600">
                    {d.errorMessage}
                  </div>
                ) : null}

                <div className="mt-3">
                  <button
                    className="rounded-xl border px-3 py-2 disabled:opacity-50"
                    onClick={() => void handleSaveOne(d)}
                    disabled={d.isSaving}
                    aria-disabled={d.isSaving}
                  >
                    {d.isSaving ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

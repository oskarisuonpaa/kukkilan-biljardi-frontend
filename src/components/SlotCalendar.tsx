// SlotCalendar.tsx — reusable day view with 30 min slots, drag-to-select, and disabled booked ranges
// - Pure React + Tailwind classes
// - Reusable for admin (create/edit bookings) and end-user reservation flow
// - Props let you control hours, slot size, date, events (booked ranges), and callbacks
//
// Usage examples are at the bottom of this file (Admin + EndUser stubs).

import React, { useMemo, useRef, useState } from "react";

export type SlotEvent = {
  id?: number | string;
  start: string; // ISO datetime
  end: string; // ISO datetime
  title?: string;
};

export type SlotCalendarProps = {
  date: Date; // which day to show
  setDate?: (d: Date) => void; // optional: parent-controlled date navigation
  startHour?: number; // e.g., 8 for 08:00
  endHour?: number; // e.g., 22 for 22:00 (end boundary)
  slotMinutes?: 15 | 30 | 60; // default 30
  events?: SlotEvent[]; // existing bookings to display/disable
  selectable?: boolean; // default true
  onSelect?: (range: { start: string; end: string }) => void; // called on mouseup
  // Optional styling hooks
  className?: string;
  showHeader?: boolean; // default true — shows date + nav buttons if setDate provided
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function pad(n: number) {
  return String(n).padStart(2, "0");
}

function atDate(date: Date, h: number, m: number) {
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

function toLocalISO(d: Date) {
  // Keep local wall time but output ISO (UTC offset baked in)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
}

function formatTime(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) {
  return aStart < bEnd && bStart < aEnd;
}

export default function SlotCalendar({
  date,
  setDate,
  startHour = 8,
  endHour = 22,
  slotMinutes = 30,
  events = [],
  selectable = true,
  onSelect,
  className,
  showHeader = true,
}: SlotCalendarProps) {
  const slotsPerHour = Math.round(60 / slotMinutes);
  const totalSlots = (endHour - startHour) * slotsPerHour;

  const slotTimes: Date[] = useMemo(() => {
    return Array.from({ length: totalSlots }, (_, i) => {
      const hour = startHour + Math.floor(i / slotsPerHour);
      const minute = (i % slotsPerHour) * slotMinutes;
      return atDate(date, hour, minute);
    });
  }, [date, endHour, slotMinutes, slotsPerHour, startHour, totalSlots]);

  // Precompute disabled indices from events
  const disabledIdx = useMemo(() => {
    const set = new Set<number>();
    for (const e of events) {
      const s = new Date(e.start);
      const ed = new Date(e.end);
      slotTimes.forEach((t, i) => {
        const tEnd = new Date(t.getTime() + slotMinutes * 60000);
        if (rangesOverlap(t, tEnd, s, ed)) set.add(i);
      });
    }
    return set;
  }, [events, slotMinutes, slotTimes]);

  // Selection state
  const [dragStart, setDragStart] = useState<number | null>(null);
  const [dragEnd, setDragEnd] = useState<number | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const clearSelection = () => {
    setDragStart(null);
    setDragEnd(null);
  };

  const handleMouseDown = (i: number) => {
    if (!selectable || disabledIdx.has(i)) return;
    setDragStart(i);
    setDragEnd(i + 1);
  };

  const handleMouseEnter = (i: number) => {
    if (dragStart === null) return;
    if (disabledIdx.has(i)) return; // skip into disabled; keep last valid
    const dir = i >= dragStart ? 1 : -1;
    const next = i + (dir > 0 ? 1 : 0);
    setDragEnd(clamp(next, 0, totalSlots));
  };

  const handleMouseUp = () => {
    if (dragStart === null || dragEnd === null) return;
    const sIdx = Math.min(dragStart, dragEnd - 1);
    const eIdx = Math.max(dragStart + 1, dragEnd);
    const start = slotTimes[sIdx];
    const end = new Date(slotTimes[eIdx - 1].getTime() + slotMinutes * 60000);

    // Validate no disabled overlap inside chosen range
    let valid = true;
    for (let i = sIdx; i < eIdx; i++) {
      if (disabledIdx.has(i)) {
        valid = false;
        break;
      }
    }

    if (valid && onSelect) {
      onSelect({ start: toLocalISO(start), end: toLocalISO(end) });
    }
    clearSelection();
  };

  // Helpers for CSS rows
  const rowHeight = 36; // px per slot

  return (
    <div
      className={"select-none " + (className ?? "")}
      onMouseLeave={() => {
        if (dragStart !== null) clearSelection();
      }}
    >
      {showHeader && (
        <div className="mb-3 flex items-center justify-between">
          <div className="font-medium">
            {new Intl.DateTimeFormat(undefined, {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(date)}
          </div>
          {setDate && (
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-lg border px-3 py-1.5"
                onClick={() =>
                  setDate(
                    new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate() - 1
                    )
                  )
                }
              >
                Prev
              </button>
              <button
                type="button"
                className="rounded-lg border px-3 py-1.5"
                onClick={() => setDate(new Date())}
              >
                Today
              </button>
              <button
                type="button"
                className="rounded-lg border px-3 py-1.5"
                onClick={() =>
                  setDate(
                    new Date(
                      date.getFullYear(),
                      date.getMonth(),
                      date.getDate() + 1
                    )
                  )
                }
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-[64px_1fr]">
        {/* Time gutter */}
        <div>
          {Array.from({ length: endHour - startHour + 1 }, (_, i) => {
            const h = startHour + i;
            const d = atDate(date, h, 0);
            return (
              <div
                key={h}
                style={{ height: rowHeight * slotsPerHour }}
                className="relative"
              >
                <div
                  className="absolute -translate-y-1/2 text-xs text-[var(--text-secondary)]"
                  style={{ top: 0 }}
                >
                  {formatTime(d)}
                </div>
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="relative rounded-lg border bg-[var(--bg-tertiary)]"
          onMouseUp={handleMouseUp}
        >
          {/* Horizontal lines */}
          {Array.from({ length: totalSlots + 1 }, (_, i) => (
            <div
              key={i}
              style={{ top: i * rowHeight }}
              className="pointer-events-none absolute left-0 right-0 h-px bg-[var(--border)]/60"
            />
          ))}

          {/* Slot hitboxes */}
          <div>
            {slotTimes.map((t, i) => {
              const disabled = disabledIdx.has(i);
              const isSelected =
                dragStart !== null &&
                dragEnd !== null &&
                i >= Math.min(dragStart, dragEnd - 1) &&
                i < Math.max(dragStart + 1, dragEnd);
              return (
                <div
                  key={i}
                  role="button"
                  style={{ height: rowHeight }}
                  className={[
                    "border-b border-transparent px-2 text-xs flex items-center",
                    disabled
                      ? "bg-[color:oklch(0.23_0.03_250_/0.25)] cursor-not-allowed"
                      : "hover:bg-[var(--bg)] cursor-pointer",
                    isSelected ? "bg-[var(--primary-subtle)]/40" : "",
                  ].join(" ")}
                  onMouseDown={() => handleMouseDown(i)}
                  onMouseEnter={() => handleMouseEnter(i)}
                  title={formatTime(t)}
                >
                  {/* optional per-slot content */}
                </div>
              );
            })}
          </div>

          {/* Render event pills */}
          {events.map((e, idx) => {
            const s = new Date(e.start);
            const ed = new Date(e.end);
            // translate to slot grid Y positions
            const startIdx = Math.max(
              0,
              Math.round(
                ((s.getHours() - startHour) * 60 + s.getMinutes()) / slotMinutes
              )
            );
            const endIdx = Math.min(
              totalSlots,
              Math.round(
                ((ed.getHours() - startHour) * 60 + ed.getMinutes()) /
                  slotMinutes
              )
            );
            const top = startIdx * rowHeight;
            const height = Math.max(
              rowHeight / 2,
              (endIdx - startIdx) * rowHeight
            );
            if (endIdx <= 0 || startIdx >= totalSlots) return null; // out of view
            return (
              <div
                key={idx}
                className="pointer-events-none absolute left-2 right-2 rounded-md bg-[var(--secondary)]/25 border border-[var(--secondary)]/50"
                style={{ top, height }}
                title={`${formatTime(s)} – ${formatTime(ed)}${
                  e.title ? " • " + e.title : ""
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-secondary)]">
        <span className="inline-block h-3 w-3 rounded-sm bg-[var(--secondary)]/25 border border-[var(--secondary)]/50" />
        <span>Varattu</span>
        <span className="inline-block h-3 w-3 rounded-sm bg-[var(--primary-subtle)]/40 ml-4" />
        <span>Valinta</span>
      </div>
    </div>
  );
}

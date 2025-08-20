import React, { useMemo, useRef, useState } from "react";
import { formatTime, rangesOverlap } from "./utils/time";
import type { SlotEvent, SlotRange } from "./types";

type SlotGridProps = {
  times: Date[];
  startHour: number;
  slotMinutes: number;
  events: SlotEvent[];
  selectable: boolean;
  onSelect?: (range: SlotRange) => void;
  rowHeight: number;
  selectedRange?: SlotRange | null;
};

export function SlotGrid({
  times,
  startHour,
  slotMinutes,
  events,
  selectable,
  onSelect,
  rowHeight,
  selectedRange,
}: SlotGridProps) {
  const totalSlots = times.length;
  const gridRef = useRef<HTMLDivElement | null>(null);

  // Disabled slots from events
  const disabledIdx = useMemo(() => {
    const set = new Set<number>();
    for (const e of events) {
      const s = new Date(e.start);
      const ed = new Date(e.end);
      times.forEach((t, i) => {
        const tEnd = new Date(t.getTime() + slotMinutes * 60000);
        if (rangesOverlap(t, tEnd, s, ed)) set.add(i);
      });
    }
    return set;
  }, [events, slotMinutes, times]);

  // Drag state (anchor = mousedown slot, hover = current slot under pointer)
  const [anchor, setAnchor] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const dragging = anchor !== null && hover !== null;

  const clearDrag = () => {
    setAnchor(null);
    setHover(null);
  };

  // Map pointer Y → slot index
  const indexFromY = (clientY: number) => {
    const rect = gridRef.current!.getBoundingClientRect();
    let idx = Math.floor((clientY - rect.top) / rowHeight);
    if (idx < 0) idx = 0;
    if (idx > totalSlots - 1) idx = totalSlots - 1;
    return idx;
  };

  // Walk from `from` toward `to`, stopping BEFORE any disabled/edge
  const contiguousToward = (from: number, to: number) => {
    const step = to >= from ? 1 : -1;
    let last = from;
    for (let k = from; k !== to + step; k += step) {
      if (k < 0 || k >= totalSlots) break;
      if (disabledIdx.has(k)) break;
      last = k;
    }
    return last;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (!selectable) return;
    const idx = indexFromY(e.clientY);
    if (disabledIdx.has(idx)) return;
    setAnchor(idx);
    setHover(idx);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (anchor === null) return;
    const raw = indexFromY(e.clientY);
    setHover(contiguousToward(anchor, raw));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (anchor === null || hover === null) return;
    const sIdx = Math.min(anchor, hover);
    const eIdx = Math.max(anchor, hover) + 1; // exclusive
    if (eIdx > sIdx && onSelect) {
      const start = times[sIdx];
      const end = new Date(times[eIdx - 1].getTime() + slotMinutes * 60000);
      onSelect({ start: start.toISOString(), end: end.toISOString() });
    }
    clearDrag();
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
  };

  // Visual dragged band
  const dragged = dragging
    ? { sIdx: Math.min(anchor!, hover!), eIdx: Math.max(anchor!, hover!) + 1 }
    : null;

  return (
    <div
      ref={gridRef}
      className="relative rounded-lg border bg-[var(--bg-tertiary)] touch-none" // touch-none = prevent scroll while dragging
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={clearDrag}
      onLostPointerCapture={clearDrag}
    >
      {/* Horizontal lines */}
      {Array.from({ length: totalSlots + 1 }, (_, i) => (
        <div
          key={i}
          style={{ top: i * rowHeight }}
          className="pointer-events-none absolute left-0 right-0 h-px bg-[var(--border)]/60"
        />
      ))}

      {/* Slot rows (no per-row handlers; grid-level pointer capture drives the drag) */}
      <div>
        {times.map((t, i) => {
          const disabled = disabledIdx.has(i);
          const sel = !!dragged && i >= dragged.sIdx && i < dragged.eIdx;
          return (
            <div
              key={i}
              style={{ height: rowHeight }}
              className={[
                "border-b border-transparent px-2 text-xs flex items-center",
                disabled
                  ? "bg-[color:oklch(0.23_0.03_250_/0.25)] cursor-not-allowed"
                  : "hover:bg-[var(--bg)] cursor-pointer",
                sel ? "bg-[var(--primary-subtle)]/40" : "",
              ].join(" ")}
              title={formatTime(t)}
            />
          );
        })}
      </div>

      {/* Existing event pills */}
      {events.map((e, idx) => {
        const s = new Date(e.start);
        const ed = new Date(e.end);
        const startIdx = Math.max(
          0,
          Math.floor(
            ((s.getHours() - startHour) * 60 + s.getMinutes()) / slotMinutes
          )
        );
        const endIdx = Math.min(
          totalSlots,
          Math.ceil(
            ((ed.getHours() - startHour) * 60 + ed.getMinutes()) / slotMinutes
          )
        );
        if (endIdx <= 0 || startIdx >= totalSlots) return null;
        const top = startIdx * rowHeight;
        const height = Math.max(rowHeight / 2, (endIdx - startIdx) * rowHeight);
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

      {/* Persistent selected range overlay */}
      {selectedRange &&
        (() => {
          const s = new Date(selectedRange.start);
          const ed = new Date(selectedRange.end);
          const startIdx = Math.max(
            0,
            Math.floor(
              ((s.getHours() - startHour) * 60 + s.getMinutes()) / slotMinutes
            )
          );
          const endIdx = Math.min(
            totalSlots,
            Math.ceil(
              ((ed.getHours() - startHour) * 60 + ed.getMinutes()) / slotMinutes
            )
          );
          if (endIdx <= 0 || startIdx >= totalSlots) return null;
          const top = startIdx * rowHeight;
          const height = Math.max(
            rowHeight / 2,
            (endIdx - startIdx) * rowHeight
          );
          return (
            <div
              className="pointer-events-none absolute left-2 right-2 rounded-md bg-[var(--primary-subtle)]/40 border border-[var(--primary-subtle)]/60"
              style={{ top, height }}
            />
          );
        })()}
    </div>
  );
}

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

  // Build a set of disabled slot indices based on existing events
  const disabledIndices = useMemo(() => {
    const indices = new Set<number>();
    for (const event of events) {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      times.forEach((slotStart, index) => {
        const slotEnd = new Date(slotStart.getTime() + slotMinutes * 60000);
        if (rangesOverlap(slotStart, slotEnd, eventStart, eventEnd)) {
          indices.add(index);
        }
      });
    }
    return indices;
  }, [events, slotMinutes, times]);

  // Drag state
  const [anchorIndex, setAnchorIndex] = useState<number | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const isDragging = anchorIndex !== null && hoverIndex !== null;

  const clearDrag = () => {
    setAnchorIndex(null);
    setHoverIndex(null);
  };

  // Map pointer Y → slot index
  const indexFromClientY = (clientY: number) => {
    const rect = gridRef.current!.getBoundingClientRect();
    let index = Math.floor((clientY - rect.top) / rowHeight);
    if (index < 0) index = 0;
    if (index > totalSlots - 1) index = totalSlots - 1;
    return index;
  };

  // Walk from `from` toward `to`, stop before any disabled index or edge
  const contiguousToward = (from: number, to: number) => {
    const step = to >= from ? 1 : -1;
    let last = from;
    for (let i = from; i !== to + step; i += step) {
      if (i < 0 || i >= totalSlots) break;
      if (disabledIndices.has(i)) break;
      last = i;
    }
    return last;
  };

  const handlePointerDown = (event: React.PointerEvent) => {
    if (!selectable) return;
    const index = indexFromClientY(event.clientY);
    if (disabledIndices.has(index)) return;
    setAnchorIndex(index);
    setHoverIndex(index);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (anchorIndex === null) return;
    const rawIndex = indexFromClientY(event.clientY);
    setHoverIndex(contiguousToward(anchorIndex, rawIndex));
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    if (anchorIndex === null || hoverIndex === null) return;
    const startIndex = Math.min(anchorIndex, hoverIndex);
    const endIndexExclusive = Math.max(anchorIndex, hoverIndex) + 1;

    if (endIndexExclusive > startIndex && onSelect) {
      const start = times[startIndex];
      const end = new Date(
        times[endIndexExclusive - 1].getTime() + slotMinutes * 60000
      );
      onSelect({ start: start.toISOString(), end: end.toISOString() });
    }

    clearDrag();
    (event.currentTarget as HTMLElement).releasePointerCapture(event.pointerId);
  };

  const dragged = isDragging
    ? {
        startIndex: Math.min(anchorIndex!, hoverIndex!),
        endIndexExclusive: Math.max(anchorIndex!, hoverIndex!) + 1,
      }
    : null;

  return (
    <div
      ref={gridRef}
      className="relative rounded-lg border border-subtle bg-surface-alt touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={clearDrag}
      onLostPointerCapture={clearDrag}
      role="grid"
      aria-label="Aikaruudukko"
    >
      {/* Horizontal slot lines */}
      {Array.from({ length: totalSlots + 1 }, (_, index) => (
        <div
          key={index}
          style={{ top: index * rowHeight }}
          className="pointer-events-none absolute left-0 right-0 h-px bg-[color-mix(in_oklab, var(--border)_60%, transparent)]"
        />
      ))}

      {/* Interactive rows (grid-level pointer handlers manage the drag) */}
      <div>
        {times.map((slotStart, index) => {
          const isDisabled = disabledIndices.has(index);
          const isSelected =
            !!dragged &&
            index >= dragged.startIndex &&
            index < dragged.endIndexExclusive;

          return (
            <div
              key={index}
              style={{ height: rowHeight }}
              className={[
                "flex items-center border-b border-transparent px-2 text-xs",
                isDisabled
                  ? "cursor-not-allowed bg-[color-mix(in_oklab,var(--bg-secondary)_85%,white_15%)]"
                  : "cursor-pointer hover:bg-surface",
                isSelected
                  ? "bg-[color-mix(in_oklab,var(--primary-subtle)_40%,transparent)]"
                  : "",
              ].join(" ")}
              title={formatTime(slotStart)}
              role="row"
              aria-disabled={isDisabled || undefined}
              aria-selected={isSelected || undefined}
            />
          );
        })}
      </div>

      {/* Existing events */}
      {events.map((event, index) => {
        const start = new Date(event.start);
        const end = new Date(event.end);

        const startIndex = Math.max(
          0,
          Math.floor(
            ((start.getHours() - startHour) * 60 + start.getMinutes()) /
              slotMinutes
          )
        );
        const endIndexExclusive = Math.min(
          totalSlots,
          Math.ceil(
            ((end.getHours() - startHour) * 60 + end.getMinutes()) / slotMinutes
          )
        );

        if (endIndexExclusive <= 0 || startIndex >= totalSlots) return null;

        const top = startIndex * rowHeight;
        const height = Math.max(
          rowHeight / 2,
          (endIndexExclusive - startIndex) * rowHeight
        );

        return (
          <div
            key={index}
            className="pointer-events-none absolute left-2 right-2 rounded-md border border-[color-mix(in_oklab,var(--secondary)_50%,transparent)] bg-[color-mix(in_oklab,var(--secondary)_25%,transparent)]"
            style={{ top, height }}
            title={`${formatTime(start)} – ${formatTime(end)}${
              event.title ? " • " + event.title : ""
            }`}
            role="presentation"
          />
        );
      })}

      {/* Persistent selected range */}
      {selectedRange &&
        (() => {
          const start = new Date(selectedRange.start);
          const end = new Date(selectedRange.end);

          const startIndex = Math.max(
            0,
            Math.floor(
              ((start.getHours() - startHour) * 60 + start.getMinutes()) /
                slotMinutes
            )
          );
          const endIndexExclusive = Math.min(
            totalSlots,
            Math.ceil(
              ((end.getHours() - startHour) * 60 + end.getMinutes()) /
                slotMinutes
            )
          );

          if (endIndexExclusive <= 0 || startIndex >= totalSlots) return null;

          const top = startIndex * rowHeight;
          const height = Math.max(
            rowHeight / 2,
            (endIndexExclusive - startIndex) * rowHeight
          );

          return (
            <div
              className="pointer-events-none absolute left-2 right-2 rounded-md border border-[color-mix(in_oklab,var(--primary-subtle)_60%,transparent)] bg-[color-mix(in_oklab,var(--primary-subtle)_40%,transparent)]"
              style={{ top, height }}
              role="presentation"
            />
          );
        })()}
    </div>
  );
}

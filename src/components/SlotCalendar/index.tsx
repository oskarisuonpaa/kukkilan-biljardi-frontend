import React from "react";
import type { SlotCalendarProps } from "./types";
import { CalendarHeader } from "./Header";
import { TimeGutter } from "./TimeGutter";
import { SlotGrid } from "./SlotGrid";
import { computeSlotTimes } from "./utils/time";

export default function SlotCalendar({
  date,
  setDate,
  startHour = 8,
  endHour = 22,
  slotMinutes = 30,
  events = [],
  selectable = true,
  onSelect,
  selectedRange,
  className,
  showHeader = true,
}: SlotCalendarProps) {
  const rowHeight = 36; // px per slot
  const { times, slotsPerHour } = computeSlotTimes(
    date,
    startHour,
    endHour,
    slotMinutes
  );

  return (
    <div className={"select-none " + (className ?? "")}>
      {showHeader && <CalendarHeader date={date} setDate={setDate} />}

      <div className="grid grid-cols-[64px_1fr]">
        <TimeGutter
          date={date}
          startHour={startHour}
          endHour={endHour}
          slotsPerHour={slotsPerHour}
          rowHeight={rowHeight}
        />
        <SlotGrid
          times={times}
          startHour={startHour}
          slotMinutes={slotMinutes}
          events={events}
          selectable={selectable}
          onSelect={onSelect}
          rowHeight={rowHeight}
          selectedRange={selectedRange}
        />
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

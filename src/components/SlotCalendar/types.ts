export type SlotEvent = {
  id?: number | string;
  start: string; // ISO datetime
  end: string; // ISO datetime
  title?: string;
};

export type SlotRange = { start: string; end: string };

export type SlotCalendarProps = {
  date: Date; // day to render
  setDate?: (d: Date) => void; // enables Prev/Today/Next in header
  startHour?: number; // default 8
  endHour?: number; // default 22 (exclusive boundary)
  slotMinutes?: 15 | 30 | 60; // default 30
  events?: SlotEvent[]; // booked ranges (disabled)
  selectable?: boolean; // default true
  onSelect?: (range: SlotRange) => void; // fire on mouse up
  selectedRange?: SlotRange | null; // persistent highlight controlled by parent
  className?: string; // wrapper class
  showHeader?: boolean; // default true
};

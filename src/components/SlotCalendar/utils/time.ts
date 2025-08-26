export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
export function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function atDate(date: Date, h: number, m: number) {
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

export function toLocalISO(d: Date) {
  // Keep local wall time but output ISO (with local offset)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString();
}

export function formatTime(d: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date
) {
  return aStart < bEnd && bStart < aEnd;
}

export function computeSlotTimes(
  date: Date,
  startHour: number,
  endHour: number,
  slotMinutes: number
) {
  const slotsPerHour = Math.round(60 / slotMinutes);
  const totalSlots = (endHour - startHour) * slotsPerHour;
  const times: Date[] = Array.from({ length: totalSlots }, (_, i) => {
    const hour = startHour + Math.floor(i / slotsPerHour);
    const minute = (i % slotsPerHour) * slotMinutes;
    return atDate(date, hour, minute);
  });
  return { times, slotsPerHour, totalSlots };
}

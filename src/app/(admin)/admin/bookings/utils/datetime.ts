const formatDayWithWeekday = (date: Date): string => {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const isoDateKey = (iso: string): string => {
  return new Date(iso).toISOString().slice(0, 10);
};

const isSameCalendarDay = (iso: string, day: Date): boolean => {
  return new Date(iso).toDateString() === day.toDateString();
};

export { formatDayWithWeekday, formatTime, isoDateKey, isSameCalendarDay };

export type NoticeItem = {
  id: number;
  title: string;
  content: string;
  active: boolean;
};

export type CalendarItem = { id: number; name: string; active: boolean };

export type ContactInfoItem = { address: string; phone: string; email: string };

export type OpeningHourItem = {
  weekday: number;
  opens_at: string;
  closes_at: string;
};

export type BookingItem = {
  id: number;
  calendar_id: number;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  start: string;
  end: string;
};

export type CreateBookingParams = {
  calendarId: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
  start: string;
  end: string;
};

// Opening times use 0 = Sunday ... 6 = Saturday (JS Date convention)
export type OpeningInterval = {
  start: string; // "HH:MM", 24h
  end: string; // "HH:MM", 24h
};

export type OpeningDay = {
  weekday: number; // 0..6
  closed: boolean; // true = closed for the whole day
  intervals: OpeningInterval[]; // zero or more open intervals
};

export type OpeningException = {
  id: number;
  date: string; // "YYYY-MM-DD"
  closed: boolean;
  intervals: OpeningInterval[];
  note?: string;
};

export type NoticeItem = {
  id: number;
  title: string;
  content: string;
  active: boolean;
};

export type CalendarItem = { id: number; name: string; active: boolean };

export type ContactInfoItem = { address: string; phone: string; email: string };

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

// ===== Regular Opening Hours =====
export type OpeningHourResponse = {
  weekday: number; // 1 = Monday … 7 = Sunday
  opens_at: string; // "HH:MM:SS"
  closes_at: string; // "HH:MM:SS"
};

export type UpsertOpeningHourRequest = {
  opens_at: string; // required
  closes_at: string; // required
};

// ===== Opening Exceptions =====
export type OpeningExceptionResponse = {
  date: string; // "YYYY-MM-DD"
  is_closed: boolean;
  opens_at: string | null;
  closes_at: string | null;
};

export type UpsertOpeningExceptionRequest = {
  is_closed: boolean;
  opens_at: string | null;
  closes_at: string | null;
};

export type ExceptionsQuery = {
  from?: string; // "YYYY-MM-DD"
  to?: string; // "YYYY-MM-DD"
};

// ===== Local Frontend Helpers =====
export const WEEKDAYS_FI: Record<number, string> = {
  1: "Maanantai",
  2: "Tiistai",
  3: "Keskiviikko",
  4: "Torstai",
  5: "Perjantai",
  6: "Lauantai",
  7: "Sunnuntai",
};

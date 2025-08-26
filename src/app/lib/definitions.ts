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

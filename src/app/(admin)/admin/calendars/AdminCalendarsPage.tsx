"use client";

import { useState } from "react";
import { CalendarItem } from "@/app/lib/definitions";
import ManageCalendarsSection from "./components/ManageCalendarsSection";
import CreateCalendarSection from "./components/CreateCalendarSection";

export default function AdminCalendarsPage({
  initialCalendars,
}: {
  initialCalendars: CalendarItem[];
}) {
  const [calendars, setCalendars] = useState<CalendarItem[]>(initialCalendars);
  const [baseline, setBaseline] = useState<CalendarItem[]>(initialCalendars);

  return (
    <main>
      <CreateCalendarSection
        setCalendars={setCalendars}
        setBaseline={setBaseline}
      />
      <ManageCalendarsSection
        calendars={calendars}
        setCalendars={setCalendars}
        baselineCalendars={baseline}
        setBaselineCalendars={setBaseline}
      />
    </main>
  );
}

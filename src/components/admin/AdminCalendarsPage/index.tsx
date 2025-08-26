"use client";

import { CalendarItem } from "@/app/lib/definitions";
import CreateCalendarSection from "./CreateCalendarSection";
import { useState } from "react";
import ManageCalendarsSection from "./ManageCalendarsSection";

const AdminCalendarsPage = ({
  initialCalendars,
}: {
  initialCalendars: CalendarItem[];
}) => {
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
        baseline={baseline}
        setBaseline={setBaseline}
      />
    </main>
  );
};

export default AdminCalendarsPage;

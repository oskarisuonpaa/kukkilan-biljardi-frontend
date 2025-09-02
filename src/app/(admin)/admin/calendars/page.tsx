import { fetchCalendars } from "@/app/lib/api";
import { CalendarItem } from "@/app/lib/definitions";
import AdminCalendarsPage from "@/components/admin/AdminCalendarsPage";

const Page = async () => {
  const calendars = await fetchCalendars<CalendarItem[]>();

  return <AdminCalendarsPage initialCalendars={calendars} />;
};

export default Page;

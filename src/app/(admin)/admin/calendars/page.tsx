import AdminCalendarsPage from "@/components/admin/AdminCalendarsPage";

type CalendarItem = { id: number; name: string; active: boolean };

const initialCalendars: CalendarItem[] = [
  { id: 1, name: "Testi 1", active: true },
  { id: 2, name: "Testi 2", active: true },
  { id: 3, name: "Testi 3", active: true },
  { id: 4, name: "Testi 4", active: true },
];

const fetchCalendars = async () => {
  // const res = await fetch("https://api.example.com/calendars", {
  //   cache: "no-store",
  // });
  // if (!res.ok) throw new Error("Failed to fetch calendars");
  // return res.json();
  return initialCalendars;
};

const Page = async () => {
  const calendars = await fetchCalendars();

  return <AdminCalendarsPage initialCalendars={calendars} />;
};

export default Page;

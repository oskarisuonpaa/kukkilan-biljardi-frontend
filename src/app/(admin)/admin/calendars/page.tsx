import AdminCalendarsPage from "@/components/admin/AdminCalendarsPage";

const fetchCalendars = async () => {
  const res = await fetch("http://localhost:3001/api/calendars", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch calendars");
  const data = await res.json();
  return data;
};

const Page = async () => {
  const calendars = await fetchCalendars();

  return <AdminCalendarsPage initialCalendars={calendars} />;
};

export default Page;

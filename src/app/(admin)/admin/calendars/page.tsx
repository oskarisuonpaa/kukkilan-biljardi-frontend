import AdminCalendarsPage from "@/components/admin/AdminCalendarsPage";

const fetchCalendars = async () => {
  const response = await fetch("http://localhost:3000/api/calendars", {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!response.ok) throw new Error("Failed to fetch calendars");
  return response.json();
};

const Page = async () => {
  const calendars = await fetchCalendars();

  return <AdminCalendarsPage initialCalendars={calendars} />;
};

export default Page;

import AdminSiteSettingsPage from "@/components/admin/AdminSiteSettingsPage";

const fetchNotices = async () => {
  const res = await fetch("http://localhost:3001/api/notices", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch notices");
  const data = await res.json();
  return data;
};

const Page = async () => {
  const notices = await fetchNotices();

  return <AdminSiteSettingsPage initialNotices={notices} />;
};

export default Page;

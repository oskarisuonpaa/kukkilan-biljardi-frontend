import AdminSiteSettingsPage from "@/components/admin/AdminSiteSettingsPage";

const fetchNotices = async () => {
  const response = await fetch("/api/notices", {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!response.ok) throw new Error("Failed to fetch notices");
  return response.json();
};

const Page = async () => {
  const notices = await fetchNotices();

  return <AdminSiteSettingsPage initialNotices={notices} />;
};

export default Page;

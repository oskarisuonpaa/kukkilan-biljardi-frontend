import AdminSiteSettingsPage from "@/components/admin/AdminSiteSettingsPage";
import SiteSettingsPage from "@/components/admin/SiteSettingsPage";

const fetchNotices = async () => {
  const response = await fetch("http://localhost:3000/api/notices", {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!response.ok) throw new Error("Failed to fetch notices");
  return response.json();
};

const Page = async () => {
  const notices = await fetchNotices();

  return <SiteSettingsPage initialNotices={notices} />;

  //return <AdminSiteSettingsPage initialNotices={notices} />;
};

export default Page;

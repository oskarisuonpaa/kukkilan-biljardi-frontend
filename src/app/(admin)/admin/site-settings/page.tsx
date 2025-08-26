import SiteSettingsPage from "@/components/admin/AdminSiteSettingsPage";

const fetchNotices = async () => {
  const response = await fetch("http://localhost:3000/api/notices", {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!response.ok) throw new Error("Failed to fetch notices");
  return response.json();
};

const fetchContactInfo = async () => {
  const response = await fetch("http://localhost:3000/api/contact-info", {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!response.ok) throw new Error("Failed to fetch contact info");
  return response.json();
};

const Page = async () => {
  const notices = await fetchNotices();
  const contactInfo = await fetchContactInfo();

  return (
    <SiteSettingsPage
      initialNotices={notices}
      initialContactInfo={contactInfo}
    />
  );
};

export default Page;

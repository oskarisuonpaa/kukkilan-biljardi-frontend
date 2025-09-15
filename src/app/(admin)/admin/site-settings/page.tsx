import { fetchContactInfo, fetchNotices } from "@/app/lib/api";
import { ContactInfoItem, NoticeItem } from "@/app/lib/definitions";
import AdminSiteSettingsPage from "./AdminSettingsPage";

const Page = async () => {
  const notices = await fetchNotices<NoticeItem[]>();
  const contactInfo = await fetchContactInfo<ContactInfoItem>();

  return (
    <AdminSiteSettingsPage
      initialNotices={notices}
      initialContactInfo={contactInfo}
    />
  );
};

export default Page;

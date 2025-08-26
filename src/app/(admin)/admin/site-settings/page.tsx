import { fetchContactInfo, fetchNotices } from "@/app/lib/api";
import { ContactInfoItem, NoticeItem } from "@/app/lib/definitions";
import SiteSettingsPage from "@/components/admin/AdminSiteSettingsPage";

const Page = async () => {
  const notices = await fetchNotices<NoticeItem[]>();
  const contactInfo = await fetchContactInfo<ContactInfoItem>();

  return (
    <SiteSettingsPage
      initialNotices={notices}
      initialContactInfo={contactInfo}
    />
  );
};

export default Page;

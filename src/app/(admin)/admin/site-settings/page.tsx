import { fetchContactInfo, fetchNotices } from "@/app/lib/api";
import { ContactInfoItem, NoticeItem } from "@/app/lib/definitions";
import AdminSiteSettingsPage from "./AdminSettingsPage";
import {
  fetchOpeningDays,
  fetchOpeningExceptions,
} from "@/app/lib/openingHoursApi";

const Page = async () => {
  const notices = await fetchNotices<NoticeItem[]>();
  const contactInfo = await fetchContactInfo<ContactInfoItem>();
  const [days, exceptions] = await Promise.all([
    fetchOpeningDays(),
    fetchOpeningExceptions(),
  ]);

  return (
    <AdminSiteSettingsPage
      initialNotices={notices}
      initialContactInfo={contactInfo}
      initialOpeningDays={days}
      initialOpeningExceptions={exceptions}
    />
  );
};

export default Page;

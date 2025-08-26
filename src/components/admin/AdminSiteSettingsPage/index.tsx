"use client";

import { useState } from "react";
import CreateNoticeSection from "./CreateNoticeSection";
import { ContactInfoItem, NoticeItem } from "@/app/lib/definitions";
import ManageNoticesSection from "./ManageNoticesSection";
import ManageContactInfoSection from "./ManageContactInfoSection";

const AdminSiteSettingsPage = ({
  initialNotices,
  initialContactInfo,
}: {
  initialNotices: NoticeItem[];
  initialContactInfo: ContactInfoItem;
}) => {
  const [notices, setNotices] = useState<NoticeItem[]>(initialNotices);
  const [noticesBaseline, setNoticesBaseline] =
    useState<NoticeItem[]>(initialNotices);
  const [contactInfo, setContactInfo] =
    useState<ContactInfoItem>(initialContactInfo);
  const [contactInfoBaseline, setContactInfoBaseline] =
    useState<ContactInfoItem>(initialContactInfo);

  return (
    <main>
      <CreateNoticeSection
        notices={notices}
        setNotices={setNotices}
        setBaseline={setNoticesBaseline}
      />
      <ManageNoticesSection
        notices={notices}
        setNotices={setNotices}
        baseline={noticesBaseline}
        setBaseline={setNoticesBaseline}
      />
      <ManageContactInfoSection
        contactInfo={contactInfo}
        setContactInfo={setContactInfo}
        baseline={contactInfoBaseline}
        setBaseline={setContactInfoBaseline}
      />
    </main>
  );
};

export default AdminSiteSettingsPage;

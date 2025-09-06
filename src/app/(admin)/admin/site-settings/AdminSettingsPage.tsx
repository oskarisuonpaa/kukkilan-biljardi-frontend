"use client";

import {
  ContactInfoItem,
  NoticeItem,
  OpeningDay,
  OpeningException,
} from "@/app/lib/definitions";
import { useState } from "react";
import CreateNoticeSection from "./components/CreateNoticeSection";
import ManageNoticesSection from "./components/ManageNoticesSection";
import ManageContactInfoSection from "./components/ManageContactInfoSection";
import ManageOpeningExceptionsSection from "./components/ManageOpeningExceptionsSection";
import ManageOpeningHoursSection from "./components/ManageOpeningHoursSection";

const AdminSiteSettingsPage = ({
  initialNotices,
  initialContactInfo,
  initialOpeningDays,
  initialOpeningExceptions,
}: {
  initialNotices: NoticeItem[];
  initialContactInfo: ContactInfoItem;
  initialOpeningDays: OpeningDay[];
  initialOpeningExceptions: OpeningException[];
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
      <ManageOpeningHoursSection initialDays={initialOpeningDays} />
      <ManageOpeningExceptionsSection
        initialExceptions={initialOpeningExceptions}
      />
    </main>
  );
};

export default AdminSiteSettingsPage;

"use client";

import { useState } from "react";
import CreateNoticeSection from "./CreateNoticeSection";
import { NoticeItem } from "@/app/lib/definitions";
import ManageNoticesSection from "./ManageNoticesSection";

const AdminSiteSettingsPage = ({
  initialNotices,
}: {
  initialNotices: NoticeItem[];
}) => {
  const [notices, setNotices] = useState<NoticeItem[]>(initialNotices);
  const [noticesBaseline, setNoticesBaseline] =
    useState<NoticeItem[]>(initialNotices);
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
    </main>
  );
};

export default AdminSiteSettingsPage;

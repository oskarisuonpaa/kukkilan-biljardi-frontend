"use client";

import { useState } from "react";
import CreateNoticeSection from "./CreateNoticeSection";
import { NoticeItem } from "@/app/lib/definitions";

const SiteSettingsPage = ({
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
    </main>
  );
};

export default SiteSettingsPage;

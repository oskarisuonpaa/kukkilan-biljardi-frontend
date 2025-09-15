import { fetchNotices, fetchOpeningHours } from "@/app/lib/api";
import type { NoticeItem, OpeningHourResponse } from "@/app/lib/definitions";
import ReservationCTASection from "./components/ReservationCTASection";
import NoticeBoardSection from "./components/NoticeBoardSection";
import InfoSection from "./components/InfoSection";

async function ReserveLandingPage() {
  const openingHours = await fetchOpeningHours<OpeningHourResponse[]>();
  const notices = await fetchNotices<NoticeItem[]>();

  return (
    <main id="main" aria-labelledby="reserve-title" className="space-y-8">
      {/* Reservation call-to-action */}
      <ReservationCTASection />
      {/* Notice board */}
      <NoticeBoardSection notices={notices} />
      {/* Info */}
      <InfoSection openingHours={openingHours} />
    </main>
  );
}

export default ReserveLandingPage;

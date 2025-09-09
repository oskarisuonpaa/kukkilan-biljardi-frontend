import Link from "next/link";
import SectionWrapper from "@/components/SectionWrapper";
import { fetchNotices, fetchOpeningHours } from "@/app/lib/api";
import type { NoticeItem, OpeningHourResponse } from "@/app/lib/definitions";

/** Optional ISR; adjust as needed */
// export const revalidate = 60;

/** Weekday labels for 1–7 (ISO: Monday=1 … Sunday=7). */
const WEEKDAYS_FI: Record<number, string> = {
  1: "Maanantai",
  2: "Tiistai",
  3: "Keskiviikko",
  4: "Torstai",
  5: "Perjantai",
  6: "Lauantai",
  7: "Sunnuntai",
};

/** Returns "HH:MM" from common backend time formats like "HH:MM" or "HH:MM:SS". */
function formatHourLabel(time: string | null | undefined): string {
  if (!time) return "—";
  // Keep minutes if present; otherwise show hours only.
  // Safely handles "HH", "HH:MM", or "HH:MM:SS".
  const parts = time.split(":");
  if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
  return parts[0] ?? "—";
}

/** Returns a human-readable range like "12:00–18:00". */
function formatHourRange(
  opensAt: string | null | undefined,
  closesAt: string | null | undefined
): string {
  return `${formatHourLabel(opensAt)}–${formatHourLabel(closesAt)}`;
}

/** Sort opening hours by weekday (1–7) to ensure stable display order. */
function sortByWeekday(a: OpeningHourResponse, b: OpeningHourResponse): number {
  return a.weekday - b.weekday;
}

async function ReserveLandingPage() {
  const openingHours = await fetchOpeningHours<OpeningHourResponse[]>();
  const notices = await fetchNotices<NoticeItem[]>();

  const activeNotices = notices.filter((n) => n.active);
  const sortedOpeningHours = [...openingHours].sort(sortByWeekday);

  return (
    <main id="main" aria-labelledby="reserve-title" className="space-y-8">
      {/* Reservation call-to-action */}
      <SectionWrapper title="Varaa pöytä" id="reserve-title">
        <p className="text-muted">Tee varaus painamalla alla olevaa nappia.</p>

        <p className="mb-4 text-sm text-muted">
          Tekemällä varauksen hyväksyt{" "}
          <Link
            className="underline text-[var(--secondary)] hover:text-[var(--secondary-hover)]"
            href="/privacy"
          >
            tietosuojakäytäntömme
          </Link>
          .
        </p>

        <Link href="/reserve/tables" className="big-primary">
          Varaa nyt
        </Link>
      </SectionWrapper>

      {/* Notice board */}
      {activeNotices.length > 0 && (
        <SectionWrapper title="Ilmoitustaulu">
          <ul className="space-y-6 text-muted">
            {activeNotices.map((notice) => (
              <li
                key={
                  (notice as any).id ??
                  `${notice.title}-${notice.content.slice(0, 16)}`
                }
              >
                <h3 className="font-semibold text-[var(--text-main)]">
                  {notice.title}
                </h3>
                <p>{notice.content}</p>
              </li>
            ))}
          </ul>
        </SectionWrapper>
      )}

      {/* Booking info */}
      <SectionWrapper title="Tietoa">
        <p className="mb-2 font-semibold text-[var(--text-main)]">
          Voit varata snookerpöydän seuraavina aikoina:
        </p>

        <ul className="list-inside list-disc text-muted">
          {sortedOpeningHours.map(({ weekday, opens_at, closes_at }) => (
            <li key={weekday}>
              {WEEKDAYS_FI[weekday]} {formatHourRange(opens_at, closes_at)}
            </li>
          ))}
        </ul>
      </SectionWrapper>
    </main>
  );
}

export default ReserveLandingPage;

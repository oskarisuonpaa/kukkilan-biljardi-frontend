import { OpeningHourResponse, WEEKDAYS_FI } from "@/app/lib/definitions";
import SectionWrapper from "@/components/SectionWrapper";

function sortByWeekday(a: OpeningHourResponse, b: OpeningHourResponse): number {
  return a.weekday - b.weekday;
}

function formatHourRange(
  opensAt: string | null | undefined,
  closesAt: string | null | undefined
): string {
  return `${formatHourLabel(opensAt)}–${formatHourLabel(closesAt)}`;
}

function formatHourLabel(time: string | null | undefined): string {
  if (!time) return "—";
  // Keep minutes if present; otherwise show hours only.
  // Safely handles "HH", "HH:MM", or "HH:MM:SS".
  const parts = time.split(":");
  if (parts.length >= 2) return `${parts[0]}:${parts[1]}`;
  return parts[0] ?? "—";
}

const InfoSection = ({
  openingHours,
}: {
  openingHours: OpeningHourResponse[];
}) => {
  const sortedOpeningHours = [...openingHours].sort(sortByWeekday);

  return (
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
  );
};

export default InfoSection;

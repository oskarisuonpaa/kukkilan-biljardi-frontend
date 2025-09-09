import SectionWrapper from "@/components/SectionWrapper";
import Link from "next/link";

// TODO: Fix link button width

const ReservationCTASection = () => {
  return (
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

      <Link href="/reserve/tables" className="button button-primary">
        Varaa nyt
      </Link>
    </SectionWrapper>
  );
};

export default ReservationCTASection;

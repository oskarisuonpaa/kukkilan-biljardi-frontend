import { fetchNotices, fetchOpeningHours } from "@/app/lib/api";
import { NoticeItem, OpeningHourItem } from "@/app/lib/definitions";
import Link from "next/link";

const ReserveLandingPage = async () => {
  const openingHours: OpeningHourItem[] = await fetchOpeningHours<
    OpeningHourItem[]
  >();
  const notices: NoticeItem[] = await fetchNotices<NoticeItem[]>();
  const activeNotices: NoticeItem[] = notices.filter((notice) => notice.active);

  const weekdays: Record<number, string> = {
    1: "Ma",
    2: "Ti",
    3: "Ke",
    4: "To",
    5: "Pe",
    6: "La",
    7: "Su",
  };

  return (
    <main>
      {/* Booking Link */}
      <section>
        <header>
          <h2>Book a Table</h2>
          <div className="section-undeline" />
        </header>
        <p className="text-[var(--text-secondary)]">
          Click the button below to make a reservation.
        </p>
        <p className="mb-4 font-extralight text-sm text-[var(--text-secondary)]">
          *By making a reservation, you agree to our{" "}
          <Link
            className="text-[var(--secondary)] hover:text-[var(--secondary-hover)] underline"
            href="/privacy"
          >
            privacy policy
          </Link>
          .
        </p>
        <Link href="/reserve/tables" className="big-primary">
          Reserve Now
        </Link>
      </section>

      {/* Noticeboard */}
      {activeNotices.length > 0 && (
        <section>
          <header>
            <h2>Noticeboard</h2>
            <div className="section-undeline" />
          </header>
          <ul className="mt-4 space-y-6 text-[var(--text-secondary)]">
            {activeNotices.map((notice, id) => (
              <li key={id}>
                <h3 className="font-semibold text-[var(--text-main)]">
                  {notice.title}
                </h3>
                <p>{notice.content}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Info */}
      <section>
        <header>
          <h2>Information</h2>
          <div className="section-undeline" />
        </header>
        <p className="underline font-semibold mb-4 text-[var(--secondary)]">
          Snooker-kahvila auki sopimuksen ja varauksien mukaan!
        </p>
        <p className="mb-2 font-semibold text-[var(--text-main)]">
          Voit varata Snookerpöydän seuraavina ajankohtina:
        </p>
        <ul className="list-disc list-inside text-[var(--text-secondary)]">
          {openingHours.map(({ weekday, opens_at, closes_at }) => (
            <li key={weekday}>
              {weekdays[weekday]} {opens_at.slice(0, 2)}-{closes_at.slice(0, 2)}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default ReserveLandingPage;

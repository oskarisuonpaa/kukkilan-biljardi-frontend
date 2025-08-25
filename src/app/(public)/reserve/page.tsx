import Link from "next/link";

type NoticeItem = {
  id: number;
  title: string;
  content: string;
  active: boolean;
};

const fetchNotices = async () => {
  const response = await fetch("http://localhost:3000/api/notices", {
    cache: "no-store",
    next: { revalidate: 0 },
  });
  if (!response.ok) throw new Error("Failed to fetch notices");
  return response.json();
};

const ReserveLandingPage = async () => {
  const notices: NoticeItem[] = await fetchNotices();
  const activeNotices: NoticeItem[] = notices.filter((notice) => notice.active);

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
          <li>Ma-Pe 10-23</li>
          <li>La 10-23</li>
          <li>Su 10-23</li>
        </ul>
      </section>
    </main>
  );
};

export default ReserveLandingPage;

import Link from "next/link";

const ReserveLandingPage = () => {
  const mockNotices = [
    {
      title: "Maksutavat laajenivat - voit maksaa myös Epassilla!",
      content: "Nykyään voit maksaa varauksesi paikan päällä myös Epassilla.",
    },
    {
      title: "Muutimme hinnastoamme",
      content:
        "Kaikki tunnit ovat jatkossa 15 € / h, koskien myös jatkotunteja.",
    },
    {
      title: "Uusi sarjalippu valikoimassamme",
      content: "Nyt voit ostaa meiltä myös 10h sarjalipun hintaan 120€.",
    },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      {/* Booking Link */}
      <section className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border)]/60 shadow-sm">
        <header>
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-main)]">
            Book a Table
          </h2>
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
        <Link
          href="/reserve/tables"
          className="inline-block rounded-lg px-4 py-2 font-medium transition-colors
                     bg-[var(--primary)] text-[var(--text-main)]
                     hover:bg-[var(--primary-hover)]
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]
                     focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
        >
          Reserve Now
        </Link>
      </section>

      {/* Noticeboard */}
      <section className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border)]/60 shadow-sm">
        <header>
          <h2 className="text-xl font-semibold text-[var(--text-main)]">
            Noticeboard
          </h2>
        </header>
        <ul className="mt-4 space-y-6 text-[var(--text-secondary)]">
          {mockNotices.map((notice, id) => (
            <li key={id}>
              <h3 className="font-semibold text-[var(--text-main)]">
                {notice.title}
              </h3>
              <p>{notice.content}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Info */}
      <section className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border)]/60 shadow-sm">
        <header>
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-main)]">
            Information
          </h2>
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

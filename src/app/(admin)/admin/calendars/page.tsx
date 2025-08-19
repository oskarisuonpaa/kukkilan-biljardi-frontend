const AdminCalendarsPage = () => {
  const mockCalendars = [
    { id: 1, name: "Testi 1", active: true },
    { id: 2, name: "Testi 2", active: true },
    { id: 3, name: "Testi 3", active: true },
    { id: 4, name: "Testi 4", active: true },
  ];

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      <section className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border)]/60 shadow-sm">
        <header>
          <h2 className="text-xl font-semibold mb-4 text-[var(--text-main)] text-center">
            Varauskalenterien hallinta
          </h2>
          <ul>
            {mockCalendars.map((calendar, id) => (
              <li key={id}>
                {calendar.name}{" "}
                {calendar.active ? "Aktiivinen" : "Poissa käytöstä"}
              </li>
            ))}
          </ul>
        </header>
      </section>
    </main>
  );
};

export default AdminCalendarsPage;

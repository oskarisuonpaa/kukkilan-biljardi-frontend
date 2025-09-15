"use client";

import { fetchCalendars } from "@/app/lib/api";
import { CalendarItem } from "@/app/lib/definitions";
import Link from "next/link";
import { useEffect, useState } from "react";

type Table = {
  id: number;
  name: string;
  active: boolean;
};

type TableCardProps = {
  id: number;
  name: string;
  availableSlots: number;
};

/** Card representing a single table with availability and booking link. */
function TableCard({ id, name, availableSlots }: TableCardProps) {
  return (
    <article className="card p-5 flex flex-col items-center text-center">
      <h2 className="mb-2 text-lg font-semibold text-[var(--text-main)]">
        {name}
      </h2>

      <p className="mb-5">
        <span className="availability-chip">
          Tänään {availableSlots} vapaata aikaa
        </span>
      </p>

      <Link
        href={`/reserve/tables/${id}`}
        aria-label={`Varaa pöytä ${name}`}
        className="button button-primary"
      >
        Varaa
      </Link>
    </article>
  );
}

/** Reservation tables overview page. */
function ReserveTablePage() {
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    // Replace with real API call later.
    async function fetchTables() {
      const tables = await fetchCalendars<CalendarItem[]>();
      setTables(tables);
    }
    fetchTables();
  }, []);

  return (
    <main id="main" className="mx-auto max-w-5xl px-6 py-10">
      <section
        aria-labelledby="reserve-tables-title"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <h1 id="reserve-tables-title" className="sr-only">
          Varaa pöytä
        </h1>

        {tables
          .filter((t) => t.active)
          .map((t) => (
            <TableCard
              key={t.id}
              id={t.id}
              name={t.name}
              availableSlots={5} // TODO: fetch per-table availability
            />
          ))}
      </section>
    </main>
  );
}

export default ReserveTablePage;

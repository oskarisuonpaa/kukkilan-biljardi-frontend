"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* Types first (to avoid using before declaration) */
type Table = {
  id: number;
  name: string;
  active: boolean;
};

type TableCardProps = {
  id: number;
  tableName: string;
  availableSlots?: number;
};

/* Mock data */
const mockData: Table[] = [
  { id: 1, name: "Kaisa 1", active: true },
  { id: 2, name: "Kaisa 2", active: true },
  { id: 3, name: "Snooker 1", active: true },
  { id: 4, name: "Snooker 2", active: true },
  { id: 5, name: "Pool", active: true },
];

/* Card */
const TableCard = ({ id, tableName, availableSlots = 5 }: TableCardProps) => {
  return (
    <div className="rounded-xl border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-5 shadow-sm">
      <h2 className="mb-2 text-center text-lg font-semibold text-[var(--text-main)]">
        {tableName}
      </h2>

      {/* availability chip */}
      <p className="mb-5 text-center">
        <span className="inline-block rounded-full bg-[var(--neutral-soft)] px-3 py-1 text-sm font-medium text-[var(--bg-secondary)]">
          Tänään {availableSlots} vapaata aikaa
        </span>
      </p>

      <Link
        href={`/reserve/tables/${id}`}
        className="block rounded-lg border border-transparent bg-[var(--primary)] px-4 py-2 text-center font-medium text-[var(--text-main)] transition-colors hover:bg-[var(--primary-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
      >
        Varaa
      </Link>
    </div>
  );
};

/* Page */
const ReserveTablePage = () => {
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // replace with real fetch later
      setTables(mockData);
    };
    fetchData();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tables
          .filter((t) => t.active)
          .map((table) => (
            <TableCard
              key={table.id}
              id={table.id}
              tableName={table.name}
              /* you can compute per-table availability here */
              availableSlots={5}
            />
          ))}
      </section>
    </main>
  );
};

export default ReserveTablePage;

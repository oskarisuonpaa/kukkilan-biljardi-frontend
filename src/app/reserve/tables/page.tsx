"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type TableCardProps = {
  id: number;
  tableName: string;
};

const mockData: Table[] = [
  {
    id: 1,
    name: "Kaisa 1",
    active: true,
  },
  {
    id: 2,
    name: "Kaisa 2",
    active: true,
  },
  {
    id: 3,
    name: "Snooker 1",
    active: true,
  },
  {
    id: 4,
    name: "Snooker 2",
    active: true,
  },
  {
    id: 5,
    name: "Pool",
    active: true,
  },
];

const TableCard = ({ id, tableName }: TableCardProps) => {
  return (
    <div className="bg-gray-600 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4 text-center">{tableName}</h2>
      <p className="mb-4 text-center">Tänään 5 vapaata aikaa</p>
      <Link
        className="bg-blue-500 text-white p-2 rounded block text-center"
        href={`/reserve/tables/${id}`}
      >
        Varaa
      </Link>
    </div>
  );
};

type Table = {
  id: number;
  name: string;
  active: boolean;
};

const ReserveTablePage = () => {
  const [tables, setTables] = useState<Table[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data: Table[] = mockData;
      setTables(data);
    };
    fetchData();
  }, []);

  return (
    <main>
      <section className="grid grid-cols-2 gap-4">
        {tables.map(
          (table) =>
            table.active && (
              <TableCard key={table.id} id={table.id} tableName={table.name} />
            )
        )}
      </section>
    </main>
  );
};

export default ReserveTablePage;

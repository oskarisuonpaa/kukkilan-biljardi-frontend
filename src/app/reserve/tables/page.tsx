import Link from "next/link";

const TableCard = ({
  tableNumber,
  availableSlots,
}: {
  tableNumber: number;
  availableSlots: number;
}) => {
  return (
    <div className="bg-gray-600 rounded-lg p-4">
      <h2 className="text-lg font-semibold mb-4 text-center">
        Pöytä {tableNumber}
      </h2>
      <p className="mb-4 text-center">Tänään {availableSlots} vapaata aikaa</p>
      <Link
        className="bg-blue-500 text-white p-2 rounded block text-center"
        href={`/reserve/tables/${tableNumber}`}
      >
        Varaa
      </Link>
    </div>
  );
};

const ReserveTablePage = () => {
  const tables = [
    { tableNumber: 1, availableSlots: 5 },
    { tableNumber: 2, availableSlots: 3 },
    { tableNumber: 3, availableSlots: 2 },
    { tableNumber: 4, availableSlots: 1 },
  ];

  return (
    <main>
      <section className="grid grid-cols-2 gap-4">
        {tables.map((table) => (
          <TableCard
            key={table.tableNumber}
            tableNumber={table.tableNumber}
            availableSlots={table.availableSlots}
          />
        ))}
      </section>
    </main>
  );
};

export default ReserveTablePage;

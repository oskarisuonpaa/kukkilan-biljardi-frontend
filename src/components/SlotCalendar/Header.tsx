type HeaderProps = {
  date: Date;
  setDate?: (d: Date) => void;
};

export function CalendarHeader({ date, setDate }: HeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="font-medium text-lg">
        {new Intl.DateTimeFormat("fi-FI", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }).format(date)}
      </div>

      {setDate && (
        <div className="flex gap-2">
          <button
            type="button"
            className="button button px-3 py-1.5"
            disabled={date.getDate() <= new Date().getDate()}
            onClick={() =>
              setDate(
                new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate() - 1
                )
              )
            }
          >
            Edellinen
          </button>

          <button
            type="button"
            className="button button-primary px-3 py-1.5"
            onClick={() => setDate(new Date())}
          >
            Tänään
          </button>

          <button
            type="button"
            className="button px-3 py-1.5"
            onClick={() =>
              setDate(
                new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate() + 1
                )
              )
            }
          >
            Seuraava
          </button>
        </div>
      )}
    </div>
  );
}

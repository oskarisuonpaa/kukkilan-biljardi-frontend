type HeaderProps = {
  date: Date;
  setDate?: (d: Date) => void;
};

export function CalendarHeader({ date, setDate }: HeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <div className="font-medium">
        {new Intl.DateTimeFormat(undefined, {
          weekday: "long",
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(date)}
      </div>
      {setDate && (
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border px-3 py-1.5"
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
            Prev
          </button>
          <button
            type="button"
            className="rounded-lg border px-3 py-1.5"
            onClick={() => setDate(new Date())}
          >
            Today
          </button>
          <button
            type="button"
            className="rounded-lg border px-3 py-1.5"
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
            Next
          </button>
        </div>
      )}
    </div>
  );
}

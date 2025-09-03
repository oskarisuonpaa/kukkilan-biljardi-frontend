import { atDate, formatTime } from "./utils/time";

type TimeGutterProps = {
  date: Date;
  startHour: number;
  endHour: number;
  slotsPerHour: number;
  rowHeight: number;
};

export function TimeGutter({
  date,
  startHour,
  endHour,
  slotsPerHour,
  rowHeight,
}: TimeGutterProps) {
  const totalHours = endHour - startHour + 1;

  return (
    <div aria-hidden>
      {Array.from({ length: totalHours }, (_, index) => {
        const hour = startHour + index;
        const labelDate = atDate(date, hour, 0);
        return (
          <div
            key={hour}
            style={{ height: rowHeight * slotsPerHour }}
            className="relative"
          >
            <div
              className="absolute top-0 -translate-y-1/2 text-xs text-muted"
              aria-label={formatTime(labelDate)}
            >
              {formatTime(labelDate)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

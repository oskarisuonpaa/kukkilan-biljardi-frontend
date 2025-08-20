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
  return (
    <div>
      {Array.from({ length: endHour - startHour + 1 }, (_, i) => {
        const h = startHour + i;
        const d = atDate(date, h, 0);
        return (
          <div
            key={h}
            style={{ height: rowHeight * slotsPerHour }}
            className="relative"
          >
            <div
              className="absolute -translate-y-1/2 text-xs text-[var(--text-secondary)]"
              style={{ top: 0 }}
            >
              {formatTime(d)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import type { OpeningException, OpeningInterval } from "@/app/lib/definitions";
import {
  createOpeningException,
  updateOpeningException,
  deleteOpeningException,
} from "@/app/lib/openingHoursApi";

type Props = {
  initialExceptions: OpeningException[]; // supply from server
};

function isValidHHMM(v: string) {
  return (
    /^\d{2}:\d{2}$/.test(v) &&
    Number(v.slice(0, 2)) < 24 &&
    Number(v.slice(3, 5)) < 60
  );
}

function intervalValid(x: OpeningInterval): boolean {
  return isValidHHMM(x.start) && isValidHHMM(x.end) && x.start < x.end;
}

export default function ManageOpeningExceptionsSection({
  initialExceptions,
}: Props) {
  const [items, setItems] = useState<OpeningException[]>(initialExceptions);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Omit<OpeningException, "id">>({
    date: "",
    closed: false,
    intervals: [{ start: "10:00", end: "16:00" }],
    note: "",
  });

  const draftError = useMemo(() => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(draft.date))
      return "Päivämäärä ei ole muodossa VVVV-KK-PP.";
    if (!draft.closed) {
      if (draft.intervals.length === 0)
        return "Lisää vähintään yksi aikaväli tai merkitse kiinni.";
      if (draft.intervals.some((iv) => !intervalValid(iv)))
        return "Aikavälit eivät ole kelvollisia.";
    }
    return "";
  }, [draft]);

  async function handleCreate() {
    if (draftError) return;
    setCreating(true);
    const optimistic: OpeningException = { id: -Date.now(), ...draft };
    setItems((prev) => [optimistic, ...prev]);
    try {
      const saved = await createOpeningException(draft);
      setItems((prev) => prev.map((x) => (x.id === optimistic.id ? saved : x)));
      setDraft({
        date: "",
        closed: false,
        intervals: [{ start: "10:00", end: "16:00" }],
        note: "",
      });
    } catch (e) {
      console.error(e);
      setItems((prev) => prev.filter((x) => x.id !== optimistic.id));
      alert("Tiedon tallennus epäonnistui.");
    } finally {
      setCreating(false);
    }
  }

  async function handleSaveRow(row: OpeningException) {
    try {
      const saved = await updateOpeningException(row.id, {
        date: row.date,
        closed: row.closed,
        intervals: row.intervals,
        note: row.note,
      });
      setItems((prev) => prev.map((x) => (x.id === row.id ? saved : x)));
    } catch (e) {
      console.error(e);
      alert("Tallennus epäonnistui.");
    }
  }

  async function handleDeleteRow(id: number) {
    if (!confirm("Poistetaanko poikkeusaukiolo?")) return;
    const prev = items;
    setItems((cur) => cur.filter((x) => x.id !== id));
    try {
      await deleteOpeningException(id);
    } catch (e) {
      console.error(e);
      setItems(prev);
      alert("Poisto epäonnistui.");
    }
  }

  return (
    <SectionWrapper title="Poikkeusaukiolot">
      {/* Create new exception */}
      <div className="card p-4 mb-4">
        <form
          className="grid grid-cols-1 gap-3 md:grid-cols-[auto_1fr] md:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          <div className="grid grid-cols-1 gap-2">
            <label className="text-sm text-muted">Päivämäärä</label>
            <input
              type="date"
              className="input-field"
              value={draft.date}
              onChange={(e) =>
                setDraft((d) => ({ ...d, date: e.target.value }))
              }
              required
            />

            <label className="flex items-center gap-2 text-muted">
              <input
                type="checkbox"
                checked={draft.closed}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    closed: e.target.checked,
                    intervals: e.target.checked
                      ? []
                      : d.intervals.length
                      ? d.intervals
                      : [{ start: "10:00", end: "16:00" }],
                  }))
                }
                className="h-5 w-5"
                style={{ accentColor: "var(--primary)" }}
              />
              <span>Kiinni</span>
            </label>

            {!draft.closed && (
              <>
                <div className="space-y-2">
                  {draft.intervals.map((iv, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2"
                    >
                      <input
                        className="input-field"
                        placeholder="HH:MM"
                        value={iv.start}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            intervals: d.intervals.map((x, idx) =>
                              idx === i ? { ...x, start: e.target.value } : x
                            ),
                          }))
                        }
                      />
                      <span className="text-sm text-muted">–</span>
                      <input
                        className="input-field"
                        placeholder="HH:MM"
                        value={iv.end}
                        onChange={(e) =>
                          setDraft((d) => ({
                            ...d,
                            intervals: d.intervals.map((x, idx) =>
                              idx === i ? { ...x, end: e.target.value } : x
                            ),
                          }))
                        }
                      />
                      <button
                        type="button"
                        className="button button-danger"
                        onClick={() =>
                          setDraft((d) => ({
                            ...d,
                            intervals: d.intervals.filter(
                              (_, idx) => idx !== i
                            ),
                          }))
                        }
                      >
                        Poista
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() =>
                      setDraft((d) => ({
                        ...d,
                        closed: false,
                        intervals: [
                          ...d.intervals,
                          { start: "10:00", end: "16:00" },
                        ],
                      }))
                    }
                  >
                    Lisää aikaväli
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="flex items-end justify-end">
            <button
              type="submit"
              className="button button-primary"
              disabled={!!draftError || creating}
            >
              {creating ? "Luodaan…" : "Lisää poikkeus"}
            </button>
          </div>
        </form>

        {draftError && (
          <p className="mt-2 text-xs" style={{ color: "var(--danger)" }}>
            {draftError}
          </p>
        )}
      </div>

      {/* Existing exceptions */}
      <ul className="space-y-3">
        {items.map((row) => (
          <li key={row.id} className="card p-4">
            <form
              className="grid grid-cols-1 gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveRow(row);
              }}
            >
              <div className="grid grid-cols-1 gap-2 md:grid-cols-[auto_1fr] md:items-center">
                <label className="text-sm text-muted">Päivämäärä</label>
                <input
                  type="date"
                  className="input-field"
                  value={row.date}
                  onChange={(e) => (row.date = e.target.value)}
                  required
                />
              </div>

              <label className="flex items-center gap-2 text-muted">
                <input
                  type="checkbox"
                  checked={row.closed}
                  onChange={(e) => {
                    row.closed = e.target.checked;
                    if (row.closed) row.intervals = [];
                  }}
                  className="h-5 w-5"
                  style={{ accentColor: "var(--primary)" }}
                />
                <span>Kiinni</span>
              </label>

              {!row.closed && (
                <div className="space-y-2">
                  {row.intervals.map((iv, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-2"
                    >
                      <input
                        className="input-field"
                        value={iv.start}
                        onChange={(e) =>
                          (row.intervals[i] = { ...iv, start: e.target.value })
                        }
                        placeholder="HH:MM"
                      />
                      <span className="text-sm text-muted">–</span>
                      <input
                        className="input-field"
                        value={iv.end}
                        onChange={(e) =>
                          (row.intervals[i] = { ...iv, end: e.target.value })
                        }
                        placeholder="HH:MM"
                      />
                      <button
                        type="button"
                        className="button button-danger"
                        onClick={() =>
                          (row.intervals = row.intervals.filter(
                            (_, idx) => idx !== i
                          ))
                        }
                      >
                        Poista
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="button button-primary"
                    onClick={() =>
                      row.intervals.push({ start: "10:00", end: "16:00" })
                    }
                  >
                    Lisää aikaväli
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 md:grid-cols-[auto_1fr] md:items-center">
                <label className="text-sm text-muted">Huomautus</label>
                <input
                  className="input-field"
                  value={row.note ?? ""}
                  onChange={(e) => (row.note = e.target.value)}
                  placeholder="Esim. Juhannus"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                <button type="submit" className="button button-primary">
                  Lähetä muutokset
                </button>
                <button
                  type="button"
                  className="button button-danger"
                  onClick={() => handleDeleteRow(row.id)}
                >
                  Poista
                </button>
              </div>
            </form>
          </li>
        ))}
      </ul>
    </SectionWrapper>
  );
}

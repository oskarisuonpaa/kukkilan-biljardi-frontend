// src/app/(admin)/admin/site-settings/components/ManageOpeningExceptionsSection.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { UpsertOpeningExceptionRequest } from "@/app/lib/definitions";
import {
  listOpeningExceptions,
  upsertOpeningException,
  deleteOpeningException,
} from "@/app/lib/openingHoursApi";

type EditableException = {
  id: string; // stable key on the client, use date as id
  date: string; // "YYYY-MM-DD"
  isClosed: boolean;
  opensAt: string; // "HH:MM"
  closesAt: string; // "HH:MM"
  isNew: boolean; // true if this row has not been persisted
  isSaving: boolean;
  errorMessage: string | null;
};

function toUiTime(hms: string | null): string {
  if (!hms) return "09:00";
  const [hh = "09", mm = "00"] = hms.split(":");
  return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
}

function toApiTime(hm: string): string {
  const [hh = "09", mm = "00"] = hm.split(":");
  return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}:00`;
}

function todayIso(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function ManageOpeningExceptionsSection() {
  const [rows, setRows] = useState<EditableException[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Load a reasonable window: from today to +90 days. Adjust as you like.
        const from = todayIso();
        const to = new Date(Date.now() + 90 * 24 * 3600 * 1000)
          .toISOString()
          .slice(0, 10);
        const data = await listOpeningExceptions({ from, to });
        if (!mounted) return;
        const mapped: EditableException[] = data.map((e) => ({
          id: e.date,
          date: e.date,
          isClosed: e.is_closed,
          opensAt: toUiTime(e.opens_at),
          closesAt: toUiTime(e.closes_at),
          isNew: false,
          isSaving: false,
          errorMessage: null,
        }));
        setRows(mapped);
        setLoadError(null);
      } catch (err) {
        setLoadError(
          (err as Error).message || "Failed to load opening exceptions"
        );
      } finally {
        setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const addNewRow = (): void => {
    setRows((prev) => [
      {
        id: `new-${Math.random().toString(36).slice(2)}`,
        date: todayIso(),
        isClosed: false,
        opensAt: "09:00",
        closesAt: "17:00",
        isNew: true,
        isSaving: false,
        errorMessage: null,
      },
      ...prev,
    ]);
  };

  const updateRow = (id: string, patch: Partial<EditableException>): void => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  };

  const removeRow = async (row: EditableException): Promise<void> => {
    if (row.isNew) {
      setRows((prev) => prev.filter((r) => r.id !== row.id));
      return;
    }
    updateRow(row.id, { isSaving: true, errorMessage: null });
    try {
      await deleteOpeningException(row.date);
      setRows((prev) => prev.filter((r) => r.id !== row.id));
    } catch (err) {
      updateRow(row.id, {
        isSaving: false,
        errorMessage: (err as Error).message,
      });
    }
  };

  const validate = (row: EditableException): string | null => {
    if (!row.date) return "Date is required.";
    if (row.isClosed) return null;
    if (!row.opensAt || !row.closesAt)
      return "Both opening and closing times are required when not closed.";
    if (row.opensAt >= row.closesAt)
      return "Opening time must be earlier than closing time.";
    return null;
  };

  const persistRow = async (row: EditableException): Promise<void> => {
    const error = validate(row);
    if (error) {
      updateRow(row.id, { errorMessage: error });
      return;
    }
    updateRow(row.id, { isSaving: true, errorMessage: null });

    const payload: UpsertOpeningExceptionRequest = row.isClosed
      ? { is_closed: true, opens_at: null, closes_at: null }
      : {
          is_closed: false,
          opens_at: toApiTime(row.opensAt),
          closes_at: toApiTime(row.closesAt),
        };

    try {
      await upsertOpeningException(row.date, payload);
      updateRow(row.id, { isSaving: false, isNew: false, errorMessage: null });
    } catch (err) {
      updateRow(row.id, {
        isSaving: false,
        errorMessage: (err as Error).message,
      });
    }
  };

  const hasSaving = useMemo(() => rows.some((r) => r.isSaving), [rows]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Opening Exceptions</h2>
        <button
          className="rounded-xl border px-4 py-2"
          onClick={addNewRow}
          disabled={isLoading}
          aria-disabled={isLoading}
        >
          Add Exception
        </button>
      </div>

      {isLoading ? (
        <div className="text-muted">Loading exceptions…</div>
      ) : loadError ? (
        <div className="text-red-600">Failed to load: {loadError}</div>
      ) : rows.length === 0 ? (
        <div className="text-muted">No exceptions in the selected window.</div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const disabled = row.isClosed;
            return (
              <div key={row.id} className="rounded-2xl border p-4 shadow-sm">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <label className="flex flex-col">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) =>
                        updateRow(row.id, { date: e.target.value })
                      }
                      className="rounded-xl border px-3 py-2"
                    />
                  </label>

                  <label className="flex items-end gap-2">
                    <input
                      type="checkbox"
                      checked={row.isClosed}
                      onChange={(e) =>
                        updateRow(row.id, { isClosed: e.target.checked })
                      }
                    />
                    <span>Closed</span>
                  </label>

                  <label className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Opens at
                    </span>
                    <input
                      type="time"
                      value={row.opensAt}
                      onChange={(e) =>
                        updateRow(row.id, { opensAt: e.target.value })
                      }
                      disabled={disabled}
                      className="rounded-xl border px-3 py-2 disabled:opacity-50"
                    />
                  </label>

                  <label className="flex flex-col">
                    <span className="text-sm text-muted-foreground">
                      Closes at
                    </span>
                    <input
                      type="time"
                      value={row.closesAt}
                      onChange={(e) =>
                        updateRow(row.id, { closesAt: e.target.value })
                      }
                      disabled={disabled}
                      className="rounded-xl border px-3 py-2 disabled:opacity-50"
                    />
                  </label>
                </div>

                {row.errorMessage ? (
                  <div className="mt-2 text-sm text-red-600">
                    {row.errorMessage}
                  </div>
                ) : null}

                <div className="mt-3 flex gap-2">
                  <button
                    className="rounded-xl border px-3 py-2 disabled:opacity-50"
                    onClick={() => void persistRow(row)}
                    disabled={row.isSaving || hasSaving}
                    aria-disabled={row.isSaving || hasSaving}
                  >
                    {row.isSaving ? "Saving…" : "Save"}
                  </button>

                  <button
                    className="rounded-xl border px-3 py-2 disabled:opacity-50"
                    onClick={() => void removeRow(row)}
                    disabled={row.isSaving || hasSaving}
                    aria-disabled={row.isSaving || hasSaving}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

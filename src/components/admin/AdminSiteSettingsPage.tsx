"use client";

import { useMemo, useState } from "react";

type NoticeItem = {
  id: string;
  title: string;
  content: string;
  active: boolean;
};

export default function AdminSiteSettingsPage({
  initialNotices,
}: {
  initialNotices: NoticeItem[];
}) {
  const [notices, setNotices] = useState<NoticeItem[]>(initialNotices);

  // New notice draft
  const [draft, setDraft] = useState<{
    title: string;
    content: string;
    active: boolean;
  }>({
    title: "",
    content: "",
    active: false,
  });

  const activeCount = useMemo(
    () => notices.filter((n) => n.active).length,
    [notices]
  );
  const isAtActiveLimit = activeCount >= 3;

  const handleTitleChange = (id: string, value: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title: value } : n))
    );
  };

  const handleContentChange = (id: string, value: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, content: value } : n))
    );
  };

  const handleActiveChange = (id: string, value: boolean) => {
    setNotices((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        // Prevent enabling if at limit
        if (value && !n.active && isAtActiveLimit) return n;
        return { ...n, active: value };
      })
    );
  };

  const handleSubmitRow = (notice: NoticeItem) => {
    // Replace with your API call/mutation
    console.log("Save notice:", notice);
  };

  const resetRow = (id: string) => {
    // Restore from initial data (or fetch original from server)
    setNotices((prev) => {
      const original = initialNotices.find((n) => n.id === id);
      if (!original) return prev;
      return prev.map((n) => (n.id === id ? { ...original } : n));
    });
  };

  const handleDelete = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  // ---- Create new notice ----
  const canToggleDraftActive = !isAtActiveLimit || draft.active; // allow turning off; block turning on at limit
  const canCreate =
    draft.title.trim().length > 0 &&
    draft.content.trim().length > 0 &&
    (!draft.active || activeCount < 3);

  const createNotice = () => {
    if (!canCreate) return;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now());
    const newNotice: NoticeItem = {
      id,
      title: draft.title.trim(),
      content: draft.content.trim(),
      active: draft.active && activeCount < 3,
    };
    setNotices((prev) => [newNotice, ...prev]);
    setDraft({ title: "", content: "", active: false });
  };

  return (
    <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
      {/* Notices */}
      <section className="rounded-xl border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-6 shadow-sm">
        <header className="mb-4">
          <h2 className="text-xl font-semibold text-[var(--text-main)]">
            Tiedotteiden hallinta
          </h2>
          <p className="text-sm text-[var(--text-secondary)]">
            Tässä voit hallita tiedotteita.{" "}
            <span className="font-bold text-[var(--secondary)]">
              Tiedotteita voi olla näkyvissä vain kolme.
            </span>
          </p>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            Aktiivisia nyt: <span className="font-semibold">{activeCount}</span>{" "}
            / 3
          </p>
        </header>

        {/* Create new notice */}
        <div className="mb-6 rounded-lg border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-4">
          <h3 className="mb-3 text-sm font-semibold text-[var(--text-main)]">
            Luo uusi tiedote
          </h3>

          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              value={draft.title}
              onChange={(e) =>
                setDraft((d) => ({ ...d, title: e.target.value }))
              }
              placeholder="Otsikko"
              className="rounded-lg border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-2
                         text-[var(--text-main)] placeholder:text-[var(--text-secondary)]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]"
            />

            <textarea
              value={draft.content}
              onChange={(e) =>
                setDraft((d) => ({ ...d, content: e.target.value }))
              }
              placeholder="Sisältö"
              rows={4}
              className="rounded-lg border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-2
                         text-[var(--text-main)] placeholder:text-[var(--text-secondary)]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]
                         resize-y"
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => {
                  const next = e.target.checked;
                  if (next && isAtActiveLimit) return; // block enabling at limit
                  setDraft((d) => ({ ...d, active: next }));
                }}
                disabled={!canToggleDraftActive}
                title={
                  isAtActiveLimit && !draft.active
                    ? "Maksimissaan 3 aktiivista tiedotetta"
                    : ""
                }
                className="h-5 w-5 align-middle accent-[var(--primary)] disabled:opacity-50"
              />
              <span className="text-[var(--text-secondary)] leading-none">
                Aktiivinen
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-2 justify-end">
              <button
                type="button"
                onClick={createNotice}
                disabled={!canCreate}
                className="rounded-lg border border-transparent bg-[var(--primary)] px-4 py-2 font-medium text-[var(--text-main)]
                           transition-colors hover:bg-[var(--primary-hover)]
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]
                           focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Luo tiedote
              </button>
            </div>

            {!canCreate &&
              (draft.title.trim() === "" || draft.content.trim() === "") && (
                <p className="text-xs text-[var(--danger)]">
                  Otsikko ja sisältö ovat pakollisia.
                </p>
              )}
            {!canCreate && draft.active && isAtActiveLimit && (
              <p className="text-xs text-[var(--danger)]">
                Et voi aktivoida yli kolmea tiedotetta.
              </p>
            )}
          </div>
        </div>

        {/* Existing notices */}
        <ul className="space-y-4">
          {notices.map((notice) => {
            const disableActivate = isAtActiveLimit && !notice.active;
            return (
              <li
                key={notice.id}
                className="rounded-lg border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-4"
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmitRow(notice);
                  }}
                  className="grid grid-cols-1 gap-4"
                >
                  {/* title */}
                  <input
                    type="text"
                    value={notice.title}
                    onChange={(e) =>
                      handleTitleChange(notice.id, e.target.value)
                    }
                    placeholder="Otsikko"
                    className="rounded-lg border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-2
                               text-[var(--text-main)] placeholder:text-[var(--text-secondary)]
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]"
                  />

                  {/* content (multiline) */}
                  <textarea
                    value={notice.content}
                    onChange={(e) =>
                      handleContentChange(notice.id, e.target.value)
                    }
                    placeholder="Sisältö"
                    rows={4}
                    className="rounded-lg border border-[var(--border)]/60 bg-[var(--bg-secondary)] p-2
                               text-[var(--text-main)] placeholder:text-[var(--text-secondary)]
                               focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]
                               resize-y"
                  />

                  {/* active */}
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={notice.active}
                      onChange={(e) =>
                        handleActiveChange(notice.id, e.target.checked)
                      }
                      disabled={disableActivate}
                      title={
                        disableActivate
                          ? "Maksimissaan 3 aktiivista tiedotetta"
                          : ""
                      }
                      className="h-5 w-5 align-middle accent-[var(--primary)] disabled:opacity-50"
                    />
                    <span className="text-[var(--text-secondary)] leading-none">
                      Aktiivinen
                    </span>
                  </label>

                  {/* actions (under inputs) */}
                  <div className="flex flex-wrap items-center gap-2 justify-end">
                    <button
                      type="submit"
                      className="rounded-lg border border-transparent bg-[var(--primary)] px-4 py-2 font-medium text-[var(--text-main)]
                                 transition-colors hover:bg-[var(--primary-hover)]
                                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]
                                 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
                    >
                      Lähetä muutokset
                    </button>

                    <button
                      type="button"
                      onClick={() => resetRow(notice.id)}
                      className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 font-medium text-[var(--text-main)]
                                 hover:border-[var(--secondary)] hover:text-[var(--secondary)]
                                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-subtle)]"
                    >
                      Palauta
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(notice.id)}
                      className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 font-medium text-[var(--text-main)]
                                 hover:border-[var(--danger)] hover:text-[var(--danger)]
                                 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--danger)]"
                    >
                      Poista
                    </button>
                  </div>
                </form>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Opening Times */}
      {/* Contact Info */}
    </main>
  );
}

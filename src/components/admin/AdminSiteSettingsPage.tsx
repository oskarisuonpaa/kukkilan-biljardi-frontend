"use client";

// TODO: CLEAN THIS SHIT UP

import { useMemo, useState } from "react";

type NoticeItem = {
  id: number;
  title: string;
  content: string;
  active: boolean;
};

const AdminSiteNoticesSection = ({
  initialNotices,
}: {
  initialNotices: NoticeItem[];
}) => {
  // live UI state
  const [notices, setNotices] = useState<NoticeItem[]>(initialNotices);
  // server-synced baseline state
  const [baseline, setBaseline] = useState<NoticeItem[]>(initialNotices);

  // create form state
  const [creating, setCreating] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newContent, setNewContent] = useState<string>("");
  const [newActive, setNewActive] = useState<boolean>(true);

  const activeCount = useMemo(
    () => notices.filter((n) => n.active).length,
    [notices]
  );
  const isAtActiveLimit = activeCount >= 3;

  const canToggleDraftActive = !isAtActiveLimit || newActive;
  const canCreate =
    newTitle.trim().length > 0 &&
    newContent.trim().length > 0 &&
    (!newActive || activeCount < 3);

  // edit handlers
  const handleTitleChange = (id: number, value: string) => {
    setNotices((previous) =>
      previous.map((notice) =>
        notice.id === id ? { ...notice, title: value } : notice
      )
    );
  };

  const handleContentChange = (id: number, value: string) => {
    setNotices((previous) =>
      previous.map((notice) =>
        notice.id === id ? { ...notice, content: value } : notice
      )
    );
  };

  const handleActiveChange = (id: number, value: boolean) => {
    setNotices((previous) =>
      previous.map((notice) =>
        notice.id === id ? { ...notice, active: value } : notice
      )
    );
  };

  // PUT
  const handleSubmitRow = async (item: NoticeItem) => {
    const response = await fetch(`/api/notices/${item.id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: item.title,
        content: item.content,
        active: item.active,
      }),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to update notice");
    }

    const saved: NoticeItem = await response.json();

    setNotices((previous) =>
      previous.map((notice) => (notice.id === saved.id ? saved : notice))
    );
    setBaseline((previous) =>
      previous.some((b) => b.id === saved.id)
        ? previous.map((b) => (b.id === saved.id ? saved : b))
        : [saved, ...previous]
    );
  };

  // POST
  const handleCreate = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    setCreating(true);

    const temp: NoticeItem = {
      id: -Date.now(),
      title: newTitle.trim(),
      content: newContent.trim(),
      active: newActive,
    };

    setNotices((previous) => [temp, ...previous]);

    try {
      const response = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: temp.title,
          content: temp.content,
          active: temp.active,
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "Create failed");
        throw new Error(text);
      }

      const created: NoticeItem = await response.json();

      setNotices((previous) =>
        previous.map((notice) => (notice.id === temp.id ? created : notice))
      );
      setBaseline((previous) => [created, ...previous]);

      setNewTitle("");
      setNewContent("");
      setNewActive(true);
    } catch (error) {
      setNotices((previous) =>
        previous.filter((notice) => notice.id !== temp.id)
      );

      console.error("Create failed", error);
    } finally {
      setCreating(false);
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    if (!confirm("Poistetaanko tämä tiedote?")) return;

    const previousUI = notices;
    const previousBaseline = baseline;

    setNotices((notices) => notices.filter((notice) => notice.id !== id));
    setBaseline((notices) => notices.filter((notice) => notice.id !== id));

    try {
      const response = await fetch(`/api/notices/${id}`, { method: "DELETE" });

      if (!response.ok) throw new Error("Delete failed");
    } catch (error) {
      setNotices(previousUI);
      setBaseline(previousBaseline);

      console.log(error);
    }
  };

  // Reset row
  const resetRow = (id: number) => {
    const original = baseline.find((item) => item.id === id);
    setNotices((previous) =>
      original
        ? previous.map((notice) =>
            notice.id === id ? { ...original } : notice
          )
        : previous.filter((notice) => notice.id !== id)
    );
  };

  return (
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
          Aktiivisia nyt: <span className="font-semibold">{activeCount}</span> /
          3
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
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Otsikko"
            className="text"
          />

          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Sisältö"
            rows={4}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={newActive}
              onChange={(e) => {
                const next = e.target.checked;
                if (next && isAtActiveLimit) return; // block enabling at limit
                setNewActive(next);
              }}
              disabled={!canToggleDraftActive}
              title={
                isAtActiveLimit && !newActive
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
              onClick={handleCreate}
              disabled={!canCreate || creating}
              className="primary"
            >
              {creating ? "Luodaan…" : "Luo tiedote"}
            </button>
          </div>

          {!canCreate &&
            (newTitle.trim() === "" || newContent.trim() === "") && (
              <p className="text-xs text-[var(--danger)]">
                Otsikko ja sisältö ovat pakollisia.
              </p>
            )}
          {!canCreate && newActive && isAtActiveLimit && (
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
                  onChange={(e) => handleTitleChange(notice.id, e.target.value)}
                  placeholder="Otsikko"
                  className="text"
                />

                {/* content (multiline) */}
                <textarea
                  value={notice.content}
                  onChange={(e) =>
                    handleContentChange(notice.id, e.target.value)
                  }
                  placeholder="Sisältö"
                  rows={4}
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
                  <button type="submit" className="primary">
                    Lähetä muutokset
                  </button>

                  <button
                    type="button"
                    onClick={() => resetRow(notice.id)}
                    className="danger"
                  >
                    Palauta
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(notice.id)}
                    className="danger"
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
  );
};

export default function AdminSiteSettingsPage({
  initialNotices,
}: {
  initialNotices: NoticeItem[];
}) {
  return (
    <main>
      {/* Notices */}
      <AdminSiteNoticesSection initialNotices={initialNotices} />
      {/* Opening Times */}
      {/* Contact Info */}
    </main>
  );
}

"use client";

import { useState } from "react";

const mockNotices = [
  {
    id: 1,
    title: "Title",
    content: "Ayy LMAO.",
    active: true,
  },
  {
    id: 2,
    title: "Title 2",
    content: "Ayy LMAO. part 2",
    active: true,
  },
  {
    id: 3,
    title: "EI Sameja",
    content: "Samit ovat kiellettyjä näissä tiloissa.",
    active: true,
  },
];

export default function AdminSiteSettingsPage() {
  const [notices, setNotices] = useState(mockNotices);

  const handleTitleChange = (id: number, value: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title: value } : n))
    );
  };

  const handleContentChange = (id: number, value: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, content: value } : n))
    );
  };

  const handleActiveChange = (id: number, value: boolean) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, active: value } : n))
    );
  };

  const handleSubmitRow = (notice: unknown) => {
    console.log("Save notice:", notice);
    // API call or mutation goes here
  };

  const resetRow = (id: number) => {
    console.log("Reset notice:", id);
    // restore to initial mock data or fetch original values
  };

  const handleDelete = (id: number) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
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
        </header>

        <ul className="space-y-4">
          {notices.map((notice) => (
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
                    className="h-5 w-5 align-middle accent-[var(--primary)]"
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
          ))}
        </ul>
      </section>

      {/* Opening Times */}
      {/* Contact Info */}
    </main>
  );
}

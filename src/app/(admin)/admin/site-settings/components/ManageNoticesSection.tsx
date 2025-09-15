"use client";

import { useMemo } from "react";
import { NoticeItem } from "@/app/lib/definitions";
import SectionWrapper from "@/components/SectionWrapper";

type ManageNoticesSectionProps = {
  notices: NoticeItem[];
  setNotices: React.Dispatch<React.SetStateAction<NoticeItem[]>>;
  baseline: NoticeItem[];
  setBaseline: React.Dispatch<React.SetStateAction<NoticeItem[]>>;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export default function ManageNoticesSection({
  notices,
  setNotices,
  baseline,
  setBaseline,
}: ManageNoticesSectionProps) {
  const activeCount = useMemo(
    () => notices.filter((n) => n.active).length,
    [notices]
  );
  const isAtActiveLimit = activeCount >= 3;

  const handleTitleChange = (id: number, value: string) => {
    setNotices((prev) =>
      prev.map((notice) =>
        notice.id === id ? { ...notice, title: value } : notice
      )
    );
  };

  const handleContentChange = (id: number, value: string) => {
    setNotices((prev) =>
      prev.map((notice) =>
        notice.id === id ? { ...notice, content: value } : notice
      )
    );
  };

  const handleActiveChange = (id: number, value: boolean) => {
    setNotices((prev) =>
      prev.map((notice) =>
        notice.id === id ? { ...notice, active: value } : notice
      )
    );
  };

  const handleSubmitRow = async (item: NoticeItem) => {
    try {
      const response = await fetch(`${API_BASE}/api/notices/${item.id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: item.title,
          content: item.content,
          active: item.active,
        }),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update notice");

      const saved: NoticeItem = await response.json();

      setNotices((prev) => prev.map((n) => (n.id === saved.id ? saved : n)));
      setBaseline((prev) =>
        prev.some((b) => b.id === saved.id)
          ? prev.map((b) => (b.id === saved.id ? saved : b))
          : [saved, ...prev]
      );
    } catch (error) {
      console.error(error);
      alert("Tallennus epäonnistui. Yritä uudelleen.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Poistetaanko tämä tiedote?")) return;

    const previousUI = notices;
    const previousBaseline = baseline;

    setNotices((ns) => ns.filter((n) => n.id !== id));
    setBaseline((bs) => bs.filter((n) => n.id !== id));

    try {
      const response = await fetch(`${API_BASE}/api/notices/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Delete failed");
    } catch (error) {
      console.error(error);
      // Rollback
      setNotices(previousUI);
      setBaseline(previousBaseline);
      alert("Poisto epäonnistui. Yritä uudelleen.");
    }
  };

  const resetRow = (id: number) => {
    const original = baseline.find((item) => item.id === id);
    setNotices((prev) =>
      original
        ? prev.map((notice) => (notice.id === id ? { ...original } : notice))
        : prev.filter((notice) => notice.id !== id)
    );
  };

  return (
    <SectionWrapper title="Tiedotteiden hallinta">
      <ul className="space-y-4">
        {notices.map((notice) => {
          const disableActivate = isAtActiveLimit && !notice.active;
          return (
            <li key={notice.id} className="card p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmitRow(notice);
                }}
                className="grid grid-cols-1 gap-4"
                noValidate
              >
                <input
                  type="text"
                  value={notice.title}
                  onChange={(e) => handleTitleChange(notice.id, e.target.value)}
                  placeholder="Otsikko"
                  className="input-field"
                  required
                />

                <textarea
                  value={notice.content}
                  onChange={(e) =>
                    handleContentChange(notice.id, e.target.value)
                  }
                  placeholder="Sisältö"
                  className="input-field"
                  rows={4}
                  required
                />

                <label className="flex items-center gap-2 text-muted">
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
                    className="h-5 w-5 align-middle disabled:opacity-50"
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span className="leading-none">Aktiivinen</span>
                </label>

                <div className="flex flex-wrap items-center justify-end gap-2">
                  <button type="submit" className="button button-primary">
                    Lähetä muutokset
                  </button>

                  <button
                    type="button"
                    onClick={() => resetRow(notice.id)}
                    className="button button-danger"
                  >
                    Palauta
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(notice.id)}
                    className="button button-danger"
                  >
                    Poista
                  </button>
                </div>
              </form>
            </li>
          );
        })}
      </ul>
    </SectionWrapper>
  );
}

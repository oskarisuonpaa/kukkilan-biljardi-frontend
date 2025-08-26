"use client";

import { NoticeItem } from "@/app/lib/definitions";
import SectionWrapper from "@/components/SectionWrapper";
import { useMemo } from "react";

type ManageNoticesSectionProps = {
  notices: NoticeItem[];
  setNotices: React.Dispatch<React.SetStateAction<NoticeItem[]>>;
  baseline: NoticeItem[];
  setBaseline: React.Dispatch<React.SetStateAction<NoticeItem[]>>;
};

const ManageNoticesSection = ({
  notices,
  setNotices,
  baseline,
  setBaseline,
}: ManageNoticesSectionProps) => {
  const activeCount = useMemo(
    () => notices.filter((n) => n.active).length,
    [notices]
  );
  const isAtActiveLimit = activeCount >= 3;

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
    <SectionWrapper title="Tiedotteiden hallinta">
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
    </SectionWrapper>
  );
};

export default ManageNoticesSection;

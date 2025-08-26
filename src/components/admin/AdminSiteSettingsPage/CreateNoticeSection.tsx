"use client";

import { NoticeItem } from "@/app/lib/definitions";
import SectionWrapper from "@/components/SectionWrapper";
import { useMemo, useState } from "react";

type CreateNoticeSectionProps = {
  notices: NoticeItem[];
  setNotices: React.Dispatch<React.SetStateAction<NoticeItem[]>>;
  setBaseline: React.Dispatch<React.SetStateAction<NoticeItem[]>>;
};

const CreateNoticeSection = ({
  notices,
  setNotices,
  setBaseline,
}: CreateNoticeSectionProps) => {
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

  return (
    <SectionWrapper title="Luo uusi tiedote">
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

        {!canCreate && (
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
    </SectionWrapper>
  );
};

export default CreateNoticeSection;

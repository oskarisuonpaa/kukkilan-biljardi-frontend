"use client";

import { useMemo, useState } from "react";
import { NoticeItem } from "@/app/lib/definitions";
import SectionWrapper from "@/components/SectionWrapper";

type CreateNoticeSectionProps = {
  notices: NoticeItem[];
  setNotices: React.Dispatch<React.SetStateAction<NoticeItem[]>>;
  setBaseline: React.Dispatch<React.SetStateAction<NoticeItem[]>>;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export default function CreateNoticeSection({
  notices,
  setNotices,
  setBaseline,
}: CreateNoticeSectionProps) {
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newActive, setNewActive] = useState(true);

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

  async function handleCreate() {
    if (!canCreate) return;

    setCreating(true);

    const optimistic: NoticeItem = {
      id: -Date.now(),
      title: newTitle.trim(),
      content: newContent.trim(),
      active: newActive,
    };

    setNotices((prev) => [optimistic, ...prev]);

    try {
      const response = await fetch(`${API_BASE}/api/notices`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: optimistic.title,
          content: optimistic.content,
          active: optimistic.active,
        }),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => "Create failed");
        throw new Error(text);
      }

      const created: NoticeItem = await response.json();

      setNotices((prev) =>
        prev.map((n) => (n.id === optimistic.id ? created : n))
      );
      setBaseline((prev) => [created, ...prev]);

      setNewTitle("");
      setNewContent("");
      setNewActive(true);
    } catch (error) {
      console.error("Create failed", error);
      setNotices((prev) => prev.filter((n) => n.id !== optimistic.id));
      alert("Tiedotteen luonti epäonnistui. Yritä uudelleen.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <SectionWrapper title="Luo uusi tiedote">
      <form
        className="grid grid-cols-1 gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
        noValidate
      >
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Otsikko"
          className="input-field"
          required
        />

        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Sisältö"
          rows={4}
          className="input-field"
          required
        />

        <label className="flex items-center gap-2 text-muted">
          <input
            type="checkbox"
            checked={newActive}
            onChange={(e) => {
              const next = e.target.checked;
              if (next && isAtActiveLimit) return;
              setNewActive(next);
            }}
            disabled={!canToggleDraftActive}
            title={
              isAtActiveLimit && !newActive
                ? "Maksimissaan 3 aktiivista tiedotetta"
                : ""
            }
            className="h-5 w-5 align-middle disabled:opacity-50"
            style={{ accentColor: "var(--primary)" }}
          />
          <span className="leading-none">Aktiivinen</span>
        </label>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="submit"
            disabled={!canCreate || creating}
            className="button button-primary"
            aria-disabled={!canCreate || creating}
          >
            {creating ? "Luodaan…" : "Luo tiedote"}
          </button>
        </div>

        {!canCreate && (
          <p className="text-xs" style={{ color: "var(--danger)" }}>
            Otsikko ja sisältö ovat pakollisia.
          </p>
        )}
        {!canCreate && newActive && isAtActiveLimit && (
          <p className="text-xs" style={{ color: "var(--danger)" }}>
            Et voi aktivoida yli kolmea tiedotetta.
          </p>
        )}
      </form>
    </SectionWrapper>
  );
}

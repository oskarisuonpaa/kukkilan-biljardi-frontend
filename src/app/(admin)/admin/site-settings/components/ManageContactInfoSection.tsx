"use client";

import { ContactInfoItem } from "@/app/lib/definitions";
import SectionWrapper from "@/components/SectionWrapper";
import { useState } from "react";

type ManageContactInfoSectionProps = {
  contactInfo: ContactInfoItem;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfoItem>>;
  baseline: ContactInfoItem;
  setBaseline: React.Dispatch<React.SetStateAction<ContactInfoItem>>;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export default function ManageContactInfoSection({
  contactInfo,
  setContactInfo,
  baseline,
  setBaseline,
}: ManageContactInfoSectionProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleAddressChange = (value: string) =>
    setContactInfo((prev) => ({ ...prev, address: value }));

  const handlePhoneChange = (value: string) =>
    setContactInfo((prev) => ({ ...prev, phone: value }));

  const handleEmailChange = (value: string) =>
    setContactInfo((prev) => ({ ...prev, email: value }));

  const noChange =
    contactInfo.address.trim() === baseline.address.trim() &&
    contactInfo.email.trim() === baseline.email.trim() &&
    contactInfo.phone.trim() === baseline.phone.trim();

  const canSubmit =
    contactInfo.address.trim() !== "" &&
    contactInfo.email.trim() !== "" &&
    contactInfo.phone.trim() !== "";

  async function handleSubmit(item: ContactInfoItem) {
    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/contact-info`, {
        method: "PUT",
        body: JSON.stringify(item),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update contact info");
      const saved: ContactInfoItem = await response.json();
      setContactInfo(saved);
      setBaseline(saved);
    } catch (err) {
      console.error(err);
      alert("Tallennus epäonnistui. Yritä uudelleen.");
    } finally {
      setSubmitting(false);
    }
  }

  const resetRow = () => setContactInfo(baseline);

  return (
    <SectionWrapper title="Yhteystietojen hallinta">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit && !noChange) handleSubmit(contactInfo);
        }}
        className="grid grid-cols-1 gap-4"
        noValidate
      >
        <input
          type="text"
          value={contactInfo.address}
          onChange={(e) => handleAddressChange(e.target.value)}
          placeholder="Osoite"
          className="input-field"
          required
        />

        <input
          type="tel"
          value={contactInfo.phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder="Puhelin"
          className="input-field"
          inputMode="tel"
          required
        />

        <input
          type="email"
          value={contactInfo.email}
          onChange={(e) => handleEmailChange(e.target.value)}
          placeholder="Sähköposti"
          className="input-field"
          inputMode="email"
          required
        />

        {!canSubmit && (
          <p className="text-xs" style={{ color: "var(--danger)" }}>
            Yhteystiedot ovat pakollisia.
          </p>
        )}

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="submit"
            className="button button-primary"
            disabled={!canSubmit || noChange || submitting}
            aria-disabled={!canSubmit || noChange || submitting}
          >
            {submitting ? "Tallennetaan…" : "Lähetä muutokset"}
          </button>

          <button
            type="button"
            onClick={resetRow}
            className="button button-danger"
          >
            Palauta
          </button>
        </div>
      </form>
    </SectionWrapper>
  );
}

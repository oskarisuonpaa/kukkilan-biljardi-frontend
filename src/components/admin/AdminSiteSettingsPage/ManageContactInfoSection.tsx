"use client";

import { ContactInfoItem } from "@/app/lib/definitions";
import SectionWrapper from "@/components/SectionWrapper";

type ManageContactInfoSectionProps = {
  contactInfo: ContactInfoItem;
  setContactInfo: React.Dispatch<React.SetStateAction<ContactInfoItem>>;
  baseline: ContactInfoItem;
  setBaseline: React.Dispatch<React.SetStateAction<ContactInfoItem>>;
};

const ManageContactInfoSection = ({
  contactInfo,
  setContactInfo,
  baseline,
  setBaseline,
}: ManageContactInfoSectionProps) => {
  const handleAddressChange = (value: string) => {
    setContactInfo((previous) => ({ ...previous, address: value }));
  };

  const handlePhoneChange = (value: string) => {
    setContactInfo((previous) => ({ ...previous, phone: value }));
  };

  const handleEmailChange = (value: string) => {
    setContactInfo((previous) => ({ ...previous, email: value }));
  };

  const handleSubmit = async (item: ContactInfoItem) => {
    const response = await fetch("/api/contact-info", {
      method: "PUT",
      body: JSON.stringify(item),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to update contact info");
    }

    const saved: ContactInfoItem = await response.json();

    setContactInfo(saved);
    setBaseline(saved);
  };

  const resetRow = () => {
    setContactInfo(baseline);
  };

  return (
    <SectionWrapper title="Yhteystietojen hallinta">
      {" "}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(contactInfo);
        }}
        className="grid grid-cols-1 gap-4"
      >
        <input
          type="text"
          value={contactInfo.address}
          onChange={(e) => handleAddressChange(e.target.value)}
          placeholder="Osoite"
          className="text"
        />

        <input
          type="tel"
          value={contactInfo.phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          placeholder="Puhelin"
          className="text"
        />

        <input
          type="email"
          value={contactInfo.email}
          onChange={(e) => handleEmailChange(e.target.value)}
          placeholder="Sähköposti"
          className="text"
        />

        <div className="flex flex-wrap items-center gap-2 justify-end">
          <button type="submit" className="primary">
            Lähetä muutokset
          </button>

          <button type="button" onClick={resetRow} className="danger">
            Palauta
          </button>
        </div>
      </form>
    </SectionWrapper>
  );
};

export default ManageContactInfoSection;

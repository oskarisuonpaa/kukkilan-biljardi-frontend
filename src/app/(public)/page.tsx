import SectionWrapper from "@/components/SectionWrapper";
import { fetchContactInfo } from "../lib/api";
import { ContactInfoItem } from "../lib/definitions";
import Image from "next/image";

// TODO: About us data from backend

const Home = async () => {
  const contactInfo = await fetchContactInfo<ContactInfoItem>();

  const mockAboutUsData = [
    `Kun haluat pelata Snookeria, Kaisaa tai Poolia viihtyisässä ja rauhallisessa ympäristössä, tämä biljardisali on sinulle!
Tervetuloa!`,
  ];

  return (
    <main>
      <section>
        <header>
          <Image
            src="/kuksnookbiledit.png"
            alt="Kukkilan Biljardi"
            width={350}
            height={0}
            className="h-auto w-auto justify-self-center"
            priority
          />
          <div className="section-underline mb-6" aria-hidden="true" />
        </header>
        <div className="space-y-4 leading-relaxed text-center">
          {mockAboutUsData.map((data, id) => (
            <p key={id}>{data}</p>
          ))}
        </div>
      </section>

      <SectionWrapper title="Yhteystiedot">
        <div className="space-y-4 leading-relaxed">
          <ul className="space-y-3">
            <li>
              <span className="font-medium">Osoite:</span> {contactInfo.address}
            </li>
            <li>
              <span className="font-medium">Puhelin:</span> {contactInfo.phone}
            </li>
            <li>
              <span className="font-medium">Sähköposti:</span>{" "}
              {contactInfo.email}
            </li>
          </ul>
        </div>
      </SectionWrapper>
    </main>
  );
};

export default Home;

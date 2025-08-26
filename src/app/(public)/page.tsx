import { fetchContactInfo } from "../lib/api";
import { ContactInfoItem } from "../lib/definitions";

// TODO: About us data from backend

const Home = async () => {
  const contactInfo = await fetchContactInfo<ContactInfoItem>();

  const mockAboutUsData = [
    `Tule pelaamaan laadukkaalle snookerpöydällemme Lahdessa. Tilamme
            täyttävät kilpapelaajien standardit. Täällä on rauhallinen ilmapiiri
            pelata tätä hienoa herrasmieslajia.`,
    `Safari Rally Café pitää huolen, että tarjolla on erittäin laadukasta
            kahvia, myös espressopohjaisia kahveja. Juomapuolelta löytyy
            valikoituja viinejä ja oluita sekä artesaanilimonadeja.`,
    `Kahvin tarinaa kuulet lisää paikan päällä, mutta kerrottakoon, että
            kun juot tätä laadukasta Kenia-kahvia, olet makunautinnon lisäksi
            mukana istuttamassa puita Keniaan!`,
  ];

  return (
    <main>
      {/* About Us */}
      <section>
        <header>
          <h2>About Us</h2>
          <div className="section-undeline" />
        </header>
        <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
          {mockAboutUsData.map((data, id) => (
            <p key={id}>{data}</p>
          ))}
        </div>
      </section>

      {/* Contact Us */}
      <section>
        <header>
          <h2>Contact Us</h2>
          <div className="section-undeline" />
        </header>
        <ul className="space-y-3 text-[var(--text-secondary)]">
          <li>
            <span className="font-medium text-[var(--text-main)]">
              Address:
            </span>{" "}
            {contactInfo.address}
          </li>
          <li>
            <span className="font-medium text-[var(--text-main)]">Phone:</span>{" "}
            {contactInfo.phone}
          </li>
          <li>
            <span className="font-medium text-[var(--text-main)]">Email:</span>{" "}
            {contactInfo.email}
          </li>
        </ul>
      </section>
    </main>
  );
};

export default Home;

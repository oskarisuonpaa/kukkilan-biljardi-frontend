import { fetchContactInfo } from "../lib/api";
import { ContactInfoItem } from "../lib/definitions";

// TODO: About us data from backend

const Home = async () => {
  const contactInfo = await fetchContactInfo<ContactInfoItem>();

  const mockAboutUsData = [
    `Kun haluat pelata Snookeria, Kaisaa tai Poolia viihtyisässä ja rauhallisessa ympäristössä, tämä biljardisali on sinulle!
Tervetuloa!`,
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

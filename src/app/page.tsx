const Home = () => {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-8">
      {/* About Us */}
      <section className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border)]/60 shadow-sm">
        <header className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-[var(--text-main)]">
            About Us
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 rounded bg-[var(--secondary)]" />
        </header>
        <div className="space-y-4 text-[var(--text-secondary)] leading-relaxed">
          <p>
            Tule pelaamaan laadukkaalle snookerpöydällemme Lahdessa. Tilamme
            täyttävät kilpapelaajien standardit. Täällä on rauhallinen ilmapiiri
            pelata tätä hienoa herrasmieslajia.
          </p>
          <p>
            Safari Rally Café pitää huolen, että tarjolla on erittäin laadukasta
            kahvia, myös espressopohjaisia kahveja. Juomapuolelta löytyy
            valikoituja viinejä ja oluita sekä artesaanilimonadeja.
          </p>
          <p>
            Kahvin tarinaa kuulet lisää paikan päällä, mutta kerrottakoon, että
            kun juot tätä laadukasta Kenia-kahvia, olet makunautinnon lisäksi
            mukana istuttamassa puita Keniaan!
          </p>
        </div>
      </section>

      {/* Contact Us */}
      <section className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border)]/60 shadow-sm">
        <header className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-[var(--text-main)]">
            Contact Us
          </h2>
          <div className="mx-auto mt-2 h-1 w-16 rounded bg-[var(--primary)]" />
        </header>
        <ul className="space-y-3 text-[var(--text-secondary)]">
          <li>
            <span className="font-medium text-[var(--text-main)]">
              Address:
            </span>{" "}
            Telakkakatu 5, Lahti
          </li>
          <li>
            <span className="font-medium text-[var(--text-main)]">Phone:</span>{" "}
            040 042 1453
          </li>
          <li>
            <span className="font-medium text-[var(--text-main)]">Email:</span>{" "}
            vilkasprosnookervaraukset@gmail.com
          </li>
        </ul>
      </section>
    </main>
  );
};

export default Home;

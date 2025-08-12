export default function Home() {
  return (
    <main>
      {/*TLDR*/}
      <section className="bg-gray-600 rounded-lg p-4 mb-4">
        <header className="text-center mb-4">
          <h2>About Us</h2>
        </header>
        <p className="mb-4">
          Tule pelaamaan laadukkaalle snookerpöydällemme Lahdessa. Tilamme
          täyttävät kilpapelaajien standardit. Täällä on rauhallinen ilmapiiri
          pelata tätä hienoa herrasmieslajia.
        </p>
        <p className="mb-4">
          Safari Rally Café pitää huolen, että tarjolla on erittäin laadukasta
          kahvia, myös espressopohjaisia kahveja. Juomapuolelta löytyy
          valikoituja viinejä ja oluita sekä artesaanilimonadeja.
        </p>
        <p>
          Kahvin tarinaa kuulet lisää paikan päällä, mutta kerrottakoon, että
          kun juot tätä laadukasta Kenia-kahvia, olet makunautinnon lisäksi
          mukana istuttamassa puita Keniaan!
        </p>
      </section>
      {/*Contact Us*/}
      <section className="bg-gray-600 rounded-lg p-4 mb-4">
        <header className="text-center mb-4">
          <h2>Contact Us</h2>
        </header>
        <p>Telakkakatu 5, Lahti</p>
        <p>Puh. 040 042 1453</p>
        <p>vilkasprosnookervaraukset@gmail.com</p>
      </section>
    </main>
  );
}

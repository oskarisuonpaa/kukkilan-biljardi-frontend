import Link from "next/link";

const ReserveLandingPage = () => {
  return (
    <main>
      {/*Booking Link */}
      <section className="bg-gray-600 rounded-lg p-4 mb-4">
        <header>
          <h2 className="text-lg font-semibold mb-4">Book a Table</h2>
        </header>
        <p className="">Click the button below to make a reservation.</p>
        <p className="mb-4 font-extralight text-sm">
          *By making a reservation, you agree to our{" "}
          <Link className="text-blue-300" href="/privacy">
            privacy policy
          </Link>
          .
        </p>
        <Link
          className="bg-blue-500 text-white p-2 rounded"
          href="/reserve/tables"
        >
          Reserve Now
        </Link>
      </section>
      {/*Noticeboard */}
      <section className="bg-gray-600 rounded-lg p-4 mb-4">
        <header>
          <h2 className="text-lg font-semibold">Noticeboard</h2>
        </header>
        {/* {<p>Check here for any important announcements or updates.</p>} */}
        <ul>
          <li className="mt-4">
            <h3 className=" font-semibold">
              Maksutavat laajenivat - voit maksaa myös Epassilla!
            </h3>
            <p>Nykyään voit maksaa varauksesi paikan päällä myös Epassilla.</p>
          </li>
          <li className="mt-4">
            <h3 className="font-semibold">Muutimme hinnastoamme</h3>
            <p>
              Kaikki tunnit ovat jatkossa 15 € / h, koskien myös jatkotunteja.
            </p>
          </li>
          <li className="mt-4">
            <h3 className="font-semibold">Uusi sarjalippu valikoimassamme</h3>
            <p>Nyt voit ostaa meiltä myös 10h sarjalipun hintaan 120€.</p>
          </li>
        </ul>
      </section>
      {/*Info */}
      <section className="bg-gray-600 rounded-lg p-4 mb-4">
        <header>
          <h2 className="text-lg font-semibold mb-4">Information</h2>
        </header>
        <p className="underline font-semibold mb-4">
          Snooker-kahvila auki sopimuksen ja varauksien mukaan!
        </p>
        <p className="mb-2 font-semibold">
          Voit varata Snookerpöydän seuraavina ajankohtina:
        </p>
        <ul>
          <li>Ma-Pe 10-23</li>
          <li>La 10-23</li>
          <li>Su 10-23</li>
        </ul>
      </section>
    </main>
  );
};

export default ReserveLandingPage;

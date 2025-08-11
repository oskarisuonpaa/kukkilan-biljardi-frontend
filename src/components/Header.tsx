import Link from "next/link";

const Header = () => {
  return (
    //<header className="flex justify-between items-center bg-surface py-4 px-8">
    <header className="flex justify-between items-center bg-gray-800 py-4 px-8">
      <h1 className="text-xl font-bold text-white">Kukkilan Biljardi</h1>
      <nav className="flex gap-6 items-center">
        <ul className="flex gap-4">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/reserve">Make Reservation</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;

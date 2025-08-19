import Link from "next/link";

const Footer = () => {
  const mockContactData = {
    address: "Latojantie 6, 15270 Kukkila",
    phone: "040 042 1453",
    email: "vilkasprosnookervaraukset@gmail.com",
  };

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)]/60 px-6 py-10 text-[var(--text-secondary)]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {/* Quick Links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-[var(--text-main)]">
            Quick Links
          </h3>
          <ul>
            <li>
              <Link
                href="/"
                className="hover:text-[var(--secondary)] transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <a
                href="/reserve"
                className="hover:text-[var(--secondary)] transition-colors"
              >
                Make Reservation
              </a>
            </li>
            <li>
              <a
                href="/privacy"
                className="hover:text-[var(--secondary)] transition-colors"
              >
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-[var(--text-main)]">
            Follow us on social media
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href="#"
                className="hover:text-[var(--secondary)] transition-colors"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="#"
                className="hover:text-[var(--secondary)] transition-colors"
              >
                Instagram
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-[var(--text-main)]">
            Contact Information
          </h3>
          <ul className="space-y-2">
            <li>Address: {mockContactData.address}</li>
            <li>Phone: {mockContactData.phone}</li>
            <li>Email: {mockContactData.email}</li>
          </ul>
        </div>
      </div>

      {/* Created By */}
      <p className="mt-8 text-center text-sm text-[var(--text-secondary)]">
        &copy; Created by Oskari Suonpää 2025 | All rights reserved
      </p>
    </footer>
  );
};

export default Footer;

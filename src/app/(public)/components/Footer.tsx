import { fetchContactInfo } from "@/app/lib/api";
import { ContactInfoItem } from "@/app/lib/definitions";
import Link from "next/link";

// TODO: Clean

const Footer = async () => {
  const contactInfo = await fetchContactInfo<ContactInfoItem>();

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)]/60 px-6 py-10 text-[var(--text-secondary)]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        <div>
          <h3 className="mb-4 text-lg font-semibold text-[var(--text-main)]">
            Pikalinkit
          </h3>
          <ul>
            <li>
              <Link
                href="/"
                className="hover:text-[var(--secondary)] transition-colors"
              >
                Aloitus
              </Link>
            </li>
            <li>
              <a
                href="/reserve"
                className="hover:text-[var(--secondary)] transition-colors"
              >
                Tee varaus
              </a>
            </li>
            <li>
              <a
                href="/privacy"
                className="hover:text-[var(--secondary)] transition-colors"
              >
                Tietosuojakäytäntö
              </a>
            </li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-[var(--text-main)]">
            Seuraa meitä somessa
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
            Yhteystiedot
          </h3>
          <ul className="space-y-2">
            <li>Osoite: {contactInfo.address}</li>
            <li>Puhelin: {contactInfo.phone}</li>
            <li>Sähköposti: {contactInfo.email}</li>
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

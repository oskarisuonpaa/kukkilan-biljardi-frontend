"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

type NavigationLinkProps = PropsWithChildren<{
  href: string;
  startsWith?: boolean;
}>;

function NavigationLink({ href, startsWith, children }: NavigationLinkProps) {
  const pathname = usePathname();

  const shouldMatchByPrefix = startsWith ?? href !== "/";

  const isActive = shouldMatchByPrefix
    ? pathname === href ||
      pathname.startsWith(href + (href.endsWith("/") ? "" : "/"))
    : pathname === href;

  return (
    <Link
      href={href}
      className="nav-link"
      data-active={isActive ? "true" : "false"}
      aria-current={isActive ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

function Header() {
  return (
    <header className="site-header">
      <a href="#main" className="skip-link">
        Siirry sisältöön
      </a>

      <div className="site-header__inner">
        <h1 className="site-brand">
          <Link href="/" className="site-brand__link">
            Kukkilan Biljardi
          </Link>
        </h1>

        <nav className="primary-nav" aria-label="Päänavigaatio">
          <ul className="primary-nav__list">
            <li className="primary-nav__item">
              <NavigationLink href="/">Aloitus</NavigationLink>
            </li>
            <li className="primary-nav__item">
              <NavigationLink href="/reserve">Tee varaus</NavigationLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;

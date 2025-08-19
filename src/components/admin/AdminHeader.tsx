"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";

const NavLink = ({ href, children }: PropsWithChildren<{ href: string }>) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={[
        // base
        "px-2 py-1 rounded-md transition-colors",
        "text-[var(--text-secondary)] hover:text-[var(--text-main)]",
        // subtle underline accent on hover/active
        "relative after:absolute after:left-0 after:right-0 after:-bottom-1 after:h-[2px]",
        "after:scale-x-0 hover:after:scale-x-100 after:transition-transform",
        "after:bg-[var(--secondary-subtle)]",
        // active state
        isActive
          ? "text-[var(--text-main)] after:scale-x-100 after:bg-[var(--secondary)]"
          : "",
        // focus ring
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "focus-visible:ring-[var(--primary-subtle)] focus-visible:ring-offset-[var(--bg-secondary)]",
      ].join(" ")}
    >
      {children}
    </Link>
  );
};

const AdminHeader = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-[var(--bg-secondary)] border-[var(--border)]/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold leading-none text-[var(--text-main)]">
          Hallintapaneeli
        </h1>

        <nav className="flex items-center gap-6">
          <ul className="flex items-center gap-2">
            <li>
              <NavLink href="/">Home</NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;

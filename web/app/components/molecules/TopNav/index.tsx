"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";

export default function TopNav() {
  const { status } = useAuth();
  const { colorScheme, toggleTheme } = useTheme();

  if (status !== "authenticated") {
    return null;
  }

  return (
    <header className="sticky top-0 z-10 border-b border-[var(--divider)] bg-[var(--surface)]">
      <nav className="flex h-14 w-full items-center justify-between px-6">
        <Link
          href="/Home"
          className="inline-flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--background)]"
        >
          <div className="relative size-9 overflow-hidden rounded-xl bg-[var(--divider)]">
            <Image
              src="/wordvault_icon.jpg"
              alt="WordVault"
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <span className="text-lg font-bold tracking-tight text-[var(--primary-text)]">
            WordVault
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/flashcards"
            className="text-sm font-medium text-[var(--primary-text)] transition-colors hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--surface)]"
          >
            Flashcards
          </Link>
          <Link
            href="/stats"
            className="text-sm font-medium text-[var(--primary-text)] transition-colors hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--surface)]"
          >
            Stats
          </Link>
          <Link
            href="/profile"
            className="text-sm font-medium text-[var(--primary-text)] transition-colors hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--surface)]"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex size-9 items-center justify-center rounded-lg text-[var(--primary-text)] transition-colors hover:bg-[var(--divider)] hover:text-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--surface)]"
            aria-label={
              colorScheme === "dark"
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {colorScheme === "dark" ? (
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </nav>
    </header>
  );
}

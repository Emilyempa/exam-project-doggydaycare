import Link from "next/link";
import React from "react";

interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header
      className="
        relative
        w-full
        h-40
        text-beige-light
        shadow-md
        flex
        items-center
        bg-brand-primary
      "
      role="banner"
    >
      {/* Center title */}
      <div
        className="
          absolute
          inset-0
          flex
          items-center
          justify-center
          pointer-events-none
          px-4
        "
      >
        <h1 className="text-2xl font-semibold px-24 sm:px-32 text-center">
          {title}
        </h1>
      </div>

      {/* Right top: Logout */}
      <nav className="absolute top-6 right-6 z-20" aria-label="User navigation">
          <Link
            href="/home"
            className="
          rounded-md
          inline-block
          border-2
          bg-feature-primary
          px-4 py-2
          text-xl
          font-medium
          transition
          hover:bg-white
          hover:border-brand-secondary
          focus:outline-none
          focus:ring-2
          focus:ring-brand-secondary
          focus:ring-offset-2
          "
          >
            Log Out
          </Link>
      </nav>
    </header>
  );
};

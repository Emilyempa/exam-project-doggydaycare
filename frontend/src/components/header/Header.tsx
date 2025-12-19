interface HeaderProps {
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header
      className="
        relative
        w-full
        h-16
        bg-primary
        text-white
        shadow-md
        flex
        items-center
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
        "
        aria-live="polite"
      >
        <h1 className="text-lg font-semibold">
          {title}
        </h1>
      </div>

      {/* Right: Logout */}
      <div className="ml-auto pr-6">
        <form method="POST" action="/logout">
          <button
            type="submit"
            className="
              pointer-events-auto
              bg-transparent
              text-white
              font-medium
              underline-offset-4
              focus-visible:outline
              focus-visible:outline-white
              focus-visible:outline-offset-2
            "
          >
            Log out
          </button>
        </form>
      </div>
    </header>
  );
};

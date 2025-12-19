import Link from "next/link";

export default function Hero() {
  return (
    <section
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/hero.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Login-button upper right corner */}
      <div className="absolute top-6 right-6 z-20">
        <Link
          href="/login"
          className="
          rounded-md
          border border-transparent
          bg-white/90
          px-4 py-2
          text-sm font-medium
          transition
          hover:bg-white
          hover:border-primary
          "
        >
          Log In
        </Link>
      </div>

      {/* Centered content */}
      <div className="relative z-10 flex h-full items-center justify-center text-center text-[#E5E0E0] px-4">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold sm:text-6xl">
            Welcome to Doggy Daycare
          </h1>
          <p className="mt-6 text-lg sm:text-xl">
            Where every tail wags with joy and every dog is family
          </p>
        </div>
      </div>
    </section>
  );
}

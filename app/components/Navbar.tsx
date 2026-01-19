// app/components/Navbar.tsx
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#141414]"
          : "bg-gradient-to-b from-black/70 via-black/40 to-transparent"
      }`}
    >
      <nav className="px-16">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-10">
            <Link
              href="/"
              className="text-3xl font-black text-red-600 tracking-tight"
            >
              YOURU
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className="text-white hover:text-gray-300 transition-colors font-medium text-sm"
              >
                Home
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-gray-300 transition-colors text-sm font-light"
              >
                TV Shows
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-gray-300 transition-colors text-sm font-light"
              >
                Movies
              </Link>
              <Link
                href="/"
                className="text-gray-400 hover:text-gray-300 transition-colors text-sm font-light"
              >
                New & Popular
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Titles, genres..."
                  className="bg-black/70 border border-white/80 text-white px-4 py-1.5 pr-10 text-sm focus:outline-none transition-all duration-200 w-64"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-all duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

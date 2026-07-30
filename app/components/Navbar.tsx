// app/components/Navbar.tsx
"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getTopAnime, createAnimeSlug } from "@/app/lib/api";
import { showToast } from "@/app/components/ToastContainer";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeProfile] = useState({
    name: "User 1",
    color: "bg-red-600",
  });

  useEffect(() => {
    // Check local session
    const session = localStorage.getItem("user_session");
    setIsLoggedIn(!!session);

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Hide global navbar on auth & profile routes
  if (["/login", "/register", "/profiles"].includes(pathname)) {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const handlePlaySomething = async () => {
    try {
      showToast("🎲 Finding a random top anime for you...", "info");
      const topList = await getTopAnime();
      if (topList.length > 0) {
        const random = topList[Math.floor(Math.random() * topList.length)];
        const slug = createAnimeSlug(random.title);
        showToast(`🎲 Playing: ${random.title}`, "success");
        router.push(`/watch/${slug}-${random.mal_id}?ep=1`);
      }
    } catch {
      showToast("Failed to pick random anime", "error");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("user_session");
    setIsLoggedIn(false);
    setProfileDropdownOpen(false);
    showToast("Signed out successfully", "info");
    router.push("/login");
  };

  const notifications = [
    { id: 1, title: "Demon Slayer Season 4 Episode 12 is now available!", time: "2h ago" },
    { id: 2, title: "Jujutsu Kaisen Movie added to your recommended list.", time: "1d ago" },
    { id: 3, title: "New simulcast schedule released for Summer 2026.", time: "2d ago" },
  ];

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#141414]/95 backdrop-blur-md shadow-2xl"
          : "bg-gradient-to-b from-black/90 via-black/40 to-transparent"

      }`}
    >
      <nav className="px-4 sm:px-8 md:px-12 lg:px-16 max-w-[2560px] mx-auto">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-4 sm:gap-8">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

            <Link
              href="/"
              className="text-2xl sm:text-3xl font-black text-red-600 tracking-tight hover:opacity-90 transition-opacity"
            >
              YOURU
            </Link>

            <div className="hidden md:flex items-center gap-5 text-sm">
              <Link href="/" className="text-white hover:text-gray-300 font-bold transition">
                Home
              </Link>
              <Link href="/search?q=series" className="text-gray-300 hover:text-white font-light transition">
                Shows
              </Link>
              <Link href="/movies" className="text-gray-300 hover:text-white font-light transition">
                Movies
              </Link>
              <Link href="/search?q=new" className="text-gray-300 hover:text-white font-light transition">
                New & Popular
              </Link>
              <Link href="/favorites" className="text-gray-300 hover:text-white font-light transition">
                My List
              </Link>
              <Link href="/search?q=japanese" className="text-gray-300 hover:text-white font-light transition">
                Browse by Language
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Play Something Button */}
            <button
              onClick={handlePlaySomething}
              className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-3 py-1.5 rounded-full transition shadow"
              title="Play Something Random"
            >
              <span>🎲</span>
              <span>Play Something</span>
            </button>

            {/* Search Input Button */}
            {searchOpen ? (
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Titles, genres..."
                  className="bg-black/90 border border-white/40 text-white px-4 py-1.5 pr-8 text-xs sm:text-sm rounded-full focus:outline-none w-40 sm:w-64 focus:ring-2 focus:ring-red-600"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-white/10 rounded-full transition text-white"
                aria-label="Open search"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            )}

            {isLoggedIn ? (
              <>
                {/* Notification Bell Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationOpen(!notificationOpen);
                      setProfileDropdownOpen(false);
                    }}
                    className="p-2 hover:bg-white/10 rounded-full transition relative text-white"
                    aria-label="Notifications"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                  </button>

                  {notificationOpen && (
                    <div className="absolute right-0 top-12 w-72 sm:w-80 bg-[#181818] border border-white/10 rounded-xl shadow-2xl py-3 z-50 text-xs animate-fadeIn">
                      <div className="px-4 pb-2 border-b border-white/10 font-bold text-white flex items-center justify-between">
                        <span>Notifications</span>
                        <span className="text-[10px] bg-red-600 px-1.5 py-0.5 rounded text-white font-mono">NEW</span>
                      </div>
                      <div className="divide-y divide-white/5 max-h-64 overflow-y-auto">
                        {notifications.map((n) => (
                          <div key={n.id} className="p-3.5 hover:bg-white/5 transition space-y-1">
                            <p className="text-gray-200 font-medium leading-snug">{n.title}</p>
                            <span className="text-[10px] text-gray-500 block">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Avatar Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotificationOpen(false);
                    }}
                    className="flex items-center gap-1.5 group focus:outline-none"
                  >
                    <div
                      className={`w-8 h-8 rounded ${activeProfile.color} text-white font-bold flex items-center justify-center text-xs shadow border border-white/20`}
                    >
                      {activeProfile.name.charAt(0)}
                    </div>
                    <svg
                      className={`w-3.5 h-3.5 text-gray-300 group-hover:text-white transition-transform duration-200 ${
                        profileDropdownOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-12 w-52 bg-[#181818] border border-white/10 rounded-xl shadow-2xl py-2 z-50 animate-fadeIn text-xs">
                      <Link
                        href="/profiles"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="px-4 py-2.5 flex items-center gap-3 hover:bg-white/10 text-white font-bold border-b border-white/10"
                      >
                        <span>👥</span>
                        <span>Switch Profiles</span>
                      </Link>

                      <div className="py-1">
                        <Link
                          href="/favorites"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-gray-300 hover:bg-white/10 hover:text-white transition"
                        >
                          My Watchlist
                        </Link>
                        <Link
                          href="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-red-400 hover:bg-white/10 font-semibold transition"
                        >
                          Admin Dashboard
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-gray-400 hover:bg-white/10 hover:text-white transition"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Sign In Button when NOT logged in */
              <Link
                href="/login"
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-5 py-2 rounded transition shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 bg-[#141414]/98 backdrop-blur-xl animate-fadeIn text-sm">
            <div className="flex flex-col gap-2 px-2">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-white py-2 font-medium border-b border-white/5">
                Home
              </Link>
              <Link href="/search?q=series" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 py-2 font-light border-b border-white/5">
                Shows
              </Link>
              <Link href="/movies" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 py-2 font-light border-b border-white/5">
                Movies
              </Link>
              <Link href="/search?q=new" onClick={() => setMobileMenuOpen(false)} className="text-gray-300 py-2 font-light border-b border-white/5">
                New & Popular
              </Link>
              <Link href="/favorites" onClick={() => setMobileMenuOpen(false)} className="text-red-400 py-2 font-medium border-b border-white/5">
                My List
              </Link>
              {isLoggedIn ? (
                <button onClick={handleSignOut} className="text-left text-gray-400 py-2 font-light">
                  Sign Out
                </button>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-red-500 py-2 font-bold">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

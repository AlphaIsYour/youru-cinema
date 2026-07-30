// app/help/page.tsx
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 sm:pt-32 pb-20 px-4 sm:px-8 md:px-16 max-w-5xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tight">Help Center</h1>
        <p className="text-gray-400 text-sm sm:text-base font-light">
          Find answers, troubleshooting steps, and customer support for YourU Cinema.
        </p>
      </div>

      {/* Quick Search */}
      <div className="bg-[#1c1c1c] p-6 rounded-xl border border-white/10">
        <h3 className="font-bold text-base mb-3">What can we help you with today?</h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search topics, error codes, streaming issues..."
            className="flex-1 bg-[#141414] border border-white/20 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
          />
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-sm transition">
            Search
          </button>
        </div>
      </div>

      {/* Help Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#222222] p-6 rounded-xl border border-white/10">
          <span className="text-3xl mb-3 block">📱</span>
          <h3 className="font-bold text-lg mb-2">Getting Started</h3>
          <p className="text-gray-400 text-xs font-light leading-relaxed">
            How to create profiles, change audio languages, and configure video quality settings.
          </p>
        </div>

        <div className="bg-[#222222] p-6 rounded-xl border border-white/10">
          <span className="text-3xl mb-3 block">🎬</span>
          <h3 className="font-bold text-lg mb-2">Streaming & Player</h3>
          <p className="text-gray-400 text-xs font-light leading-relaxed">
            Troubleshooting buffering, subtitle display, 1080p HD stream playback, and HLS servers.
          </p>
        </div>

        <div className="bg-[#222222] p-6 rounded-xl border border-white/10">
          <span className="text-3xl mb-3 block">👤</span>
          <h3 className="font-bold text-lg mb-2">Account & Profiles</h3>
          <p className="text-gray-400 text-xs font-light leading-relaxed">
            Manage profiles, parental maturity ratings, watchlist sync, and login credentials.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 pt-8 flex items-center justify-between text-xs text-gray-400">
        <span>Still need assistance? Our support team is available 24/7.</span>
        <Link href="/contact" className="text-red-500 font-bold hover:underline">
          Contact Us &rarr;
        </Link>
      </div>
    </div>
  );
}

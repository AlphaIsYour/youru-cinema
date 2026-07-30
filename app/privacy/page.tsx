// app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 sm:pt-32 pb-20 px-4 sm:px-8 md:px-16 max-w-4xl mx-auto space-y-8 font-light text-sm sm:text-base leading-relaxed text-gray-300">
      <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Privacy Policy</h1>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
        <p>
          We respect your privacy. YourU Cinema stores minimal preferences such as your My List favorites, video playback progress, and selected active profiles locally on your device (via browser LocalStorage).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">2. How We Use Data</h2>
        <p>
          Your preferences are used solely to enhance your watching experience, enable seamless resume-playback features, and display relevant anime recommendations.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">3. Third-Party Integrations</h2>
        <p>
          Metadata and poster graphics are retrieved via trusted public APIs (MyAnimeList & Anilist). No personal credentials or private data are sold or shared with external parties.
        </p>
      </section>
    </div>
  );
}

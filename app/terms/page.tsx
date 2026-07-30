// app/terms/page.tsx
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 sm:pt-32 pb-20 px-4 sm:px-8 md:px-16 max-w-4xl mx-auto space-y-8 font-light text-sm sm:text-base leading-relaxed text-gray-300">
      <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Terms of Use</h1>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">1. Service Acceptance</h2>
        <p>
          Welcome to YourU Cinema. By accessing or using our streaming service, you agree to be bound by these Terms of Use and all applicable laws and regulations governing media access.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">2. Streaming License & Content Rights</h2>
        <p>
          YourU Cinema provides personal, non-commercial streaming of anime titles and video media. Content available on the service is protected by copyright, trademark, and intellectual property provisions.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">3. User Accounts & Profiles</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account credentials and profiles. Any activity that occurs under your account remains your responsibility.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-white">4. Streaming Quality & Availability</h2>
        <p>
          Streaming resolution (1080p, 720p, 480p) may vary depending on network connectivity, device capabilities, and server load balancing.
        </p>
      </section>
    </div>
  );
}

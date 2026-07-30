// app/corporate/page.tsx
export default function CorporatePage() {
  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 sm:pt-32 pb-20 px-4 sm:px-8 md:px-16 max-w-4xl mx-auto space-y-8 font-light text-sm sm:text-base leading-relaxed text-gray-300">
      <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">Corporate Information</h1>

      <div className="bg-[#1c1c1c] border border-white/10 p-6 sm:p-8 rounded-xl space-y-4">
        <h2 className="text-xl font-bold text-white">YourU Entertainment Inc.</h2>
        <p>
          YourU Cinema is a premier next-generation anime streaming platform built for high-performance cross-device media delivery.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs text-gray-400">
          <div>
            <span className="block font-bold text-white uppercase mb-1">Headquarters</span>
            <span>Tokyo & Jakarta Digital Hub</span>
          </div>
          <div>
            <span className="block font-bold text-white uppercase mb-1">Media License</span>
            <span>YourU Streaming Services Ltd.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// app/faq/page.tsx
import Link from "next/link";

export default function FAQPage() {
  const faqs = [
    {
      q: "What is YourU Cinema?",
      a: "YourU Cinema is a world-class anime streaming service offering a wide variety of award-winning anime series, movies, OVAs, and simulcasts directly to any device.",
    },
    {
      q: "How much does YourU Cinema cost?",
      a: "Watch YourU Cinema on your smartphone, tablet, Smart TV, laptop, or streaming device. Enjoy unlimited anime streaming completely free.",
    },
    {
      q: "Where can I watch?",
      a: "Watch anywhere, anytime. Sign in with your account to watch instantly on the web at youru-cinema.com or on any internet-connected device.",
    },
    {
      q: "How do I cancel?",
      a: "YourU Cinema is flexible. There are no pesky contracts and no commitments. You can easily cancel or manage your profile anytime online in two clicks.",
    },
    {
      q: "What can I watch on YourU Cinema?",
      a: "YourU Cinema has an extensive library of feature films, anime series, top seasonal releases, and original titles. Watch as much as you want, anytime you want.",
    },
    {
      q: "Is YourU Cinema good for kids?",
      a: "The YourU Cinema Kids experience is included in your profile options to give parents control while kids enjoy family-friendly TV shows and movies in their own space.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 sm:pt-32 pb-20 px-4 sm:px-8 md:px-16 max-w-5xl mx-auto">
      <h1 className="text-3xl sm:text-5xl font-black text-center mb-4 tracking-tight">
        Frequently Asked Questions
      </h1>
      <p className="text-gray-400 text-center text-sm sm:text-base max-w-xl mx-auto mb-12 font-light">
        Everything you need to know about streaming on YourU Cinema.
      </p>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-[#222222] border border-white/10 rounded-lg p-6 hover:bg-[#2a2a2a] transition duration-200"
          >
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              {faq.q}
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center bg-[#1c1c1c] border border-white/10 p-8 rounded-xl">
        <h3 className="text-xl font-bold mb-2">Ready to start watching?</h3>
        <p className="text-gray-400 text-sm mb-6">Explore our full catalog of trending anime releases.</p>
        <Link
          href="/"
          className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-md transition shadow-lg text-sm"
        >
          Explore Catalog
        </Link>
      </div>
    </div>
  );
}

// app/contact/page.tsx
"use client";
import { useState } from "react";
import { showToast } from "@/app/components/ToastContainer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast("Message sent to YourU Support! We will reply within 24 hours.", "success");
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 sm:pt-32 pb-20 px-4 sm:px-8 md:px-16 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl sm:text-5xl font-black mb-3 tracking-tight">Contact Us</h1>
        <p className="text-gray-400 text-sm sm:text-base font-light">
          Have feedback, feature requests, or technical inquiries? Send us a message below.
        </p>
      </div>

      {submitted ? (
        <div className="bg-[#1c1c1c] border border-emerald-500/50 p-8 rounded-xl text-center space-y-4">
          <span className="text-5xl block">✅</span>
          <h2 className="text-2xl font-bold text-emerald-400">Thank You!</h2>
          <p className="text-gray-300 text-sm font-light">
            Your message has been received. Our team will review your inquiry and get back to you shortly.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 bg-white text-black px-6 py-2.5 rounded font-bold text-xs hover:bg-gray-200 transition"
          >
            Send Another Message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#1c1c1c] border border-white/10 p-6 sm:p-10 rounded-xl space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Name</label>
              <input
                type="text"
                required
                placeholder="Your Name"
                className="w-full bg-[#141414] border border-white/20 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Email Address</label>
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                className="w-full bg-[#141414] border border-white/20 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Subject</label>
            <input
              type="text"
              required
              placeholder="e.g. Streaming issue, content suggestion"
              className="w-full bg-[#141414] border border-white/20 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">Message</label>
            <textarea
              required
              rows={5}
              placeholder="Describe your inquiry in detail..."
              className="w-full bg-[#141414] border border-white/20 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-lg transition text-sm shadow-lg"
          >
            Submit Message
          </button>
        </form>
      )}
    </div>
  );
}

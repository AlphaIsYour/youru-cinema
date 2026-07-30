// app/profiles/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/app/components/ToastContainer";

export default function ProfilesPage() {
  const router = useRouter();
  const [isManaging, setIsManaging] = useState(false);

  const profilesList = [
    { id: 1, name: "User 1", color: "bg-red-600", avatar: "👤" },
    { id: 2, name: "Kids", color: "bg-blue-600", avatar: "👶" },
    { id: 3, name: "Anime Fan", color: "bg-emerald-600", avatar: "⚡" },
    { id: 4, name: "Otaku", color: "bg-purple-600", avatar: "🚀" },
  ];

  const handleSelectProfile = (name: string) => {
    if (isManaging) {
      showToast(`Editing profile settings for "${name}"`, "info");
      return;
    }
    showToast(`Switched active profile to ${name}`, "success");
    router.push("/");
  };

  const handleAddProfile = () => {
    showToast("New profile slot created!", "info");
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col items-center justify-center p-6 sm:p-12 animate-fadeIn">
      <div className="max-w-4xl w-full text-center space-y-8 sm:space-y-12">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
          {isManaging ? "Manage Profiles:" : "Who's watching?"}
        </h1>

        {/* Profile Avatar Cards */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {profilesList.map((p) => (
            <button
              key={p.id}
              onClick={() => handleSelectProfile(p.name)}
              className="group flex flex-col items-center gap-3 focus:outline-none"
            >
              <div
                className={`relative w-24 h-24 sm:w-36 sm:h-36 rounded-lg ${p.color} flex items-center justify-center text-4xl sm:text-6xl shadow-2xl border-2 border-transparent group-hover:border-white transition-all duration-300 group-hover:scale-105`}
              >
                <span>{p.avatar}</span>
                {isManaging && (
                  <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                )}
              </div>
              <span className="text-sm sm:text-lg text-gray-400 group-hover:text-white font-medium transition">
                {p.name}
              </span>
            </button>
          ))}

          {/* Add Profile Card */}
          <button
            onClick={handleAddProfile}
            className="group flex flex-col items-center gap-3 focus:outline-none"
          >
            <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-lg bg-[#222222] hover:bg-[#2b2b2b] border-2 border-dashed border-gray-600 group-hover:border-white flex items-center justify-center text-4xl sm:text-5xl text-gray-400 group-hover:text-white transition-all duration-300 group-hover:scale-105">
              +
            </div>
            <span className="text-sm sm:text-lg text-gray-400 group-hover:text-white font-medium transition">
              Add Profile
            </span>
          </button>
        </div>

        {/* Manage Profiles Action Button */}
        <div className="pt-6">
          <button
            onClick={() => setIsManaging(!isManaging)}
            className={`px-8 py-2.5 sm:py-3 border text-xs sm:text-sm font-semibold uppercase tracking-widest transition duration-200 ${
              isManaging
                ? "bg-white text-black border-white hover:bg-gray-200"
                : "border-gray-600 text-gray-400 hover:text-white hover:border-white"
            }`}
          >
            {isManaging ? "Done" : "Manage Profiles"}
          </button>
        </div>
      </div>
    </div>
  );
}

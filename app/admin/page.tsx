// app/admin/page.tsx
"use client";

import { useState } from "react";
import {
  saveEpisodeData,
  getAnimeEpisodes,
  VideoSource,
} from "@/app/lib/videoSources";
import { showToast } from "@/app/components/ToastContainer";

export default function AdminPage() {
  const [animeId, setAnimeId] = useState("");
  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [servers, setServers] = useState<VideoSource[]>([
    { server: "Server 1", url: "" },
  ]);

  const addServer = () => {
    setServers([
      ...servers,
      { server: `Server ${servers.length + 1}`, url: "" },
    ]);
  };

  const updateServer = (
    index: number,
    field: keyof VideoSource,
    value: string,
  ) => {
    const updated = [...servers];
    updated[index] = { ...updated[index], [field]: value };
    setServers(updated);
  };

  const removeServer = (index: number) => {
    setServers(servers.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!animeId || !episodeNumber) {
      showToast("Anime ID and Episode Number are required!", "error");
      return;
    }

    const validSources = servers.filter((s) => s.url.trim() !== "");

    if (validSources.length === 0) {
      showToast("At least 1 server URL must be specified!", "error");
      return;
    }

    saveEpisodeData({
      animeId,
      episodeNumber,
      title: episodeTitle || `Episode ${episodeNumber}`,
      sources: validSources,
    });

    showToast(`Episode ${episodeNumber} saved successfully!`, "success");

    setEpisodeNumber(episodeNumber + 1);
    setEpisodeTitle("");
    setServers([{ server: "Server 1", url: "" }]);
  };

  const loadEpisodes = () => {
    if (!animeId) {
      showToast("Please enter an Anime ID first!", "error");
      return;
    }

    const episodes = getAnimeEpisodes(animeId);
    showToast(`Found ${episodes.length} custom episode sources`, "info");
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-16">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Admin Title & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Admin & Analytics Console
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm font-light mt-1">
              Control video streaming sources, inspect API health, and monitor analytics.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs px-3.5 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold">Consumet API Servers Online</span>
          </div>
        </div>

        {/* Analytics Dashboard Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 shadow-lg">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1">
              Cataloged Anime
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white">12,450+</span>
            <span className="text-[10px] text-emerald-400 block mt-2">↑ Synced with Jikan API</span>
          </div>

          <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 shadow-lg">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1">
              Active Video Endpoints
            </span>
            <span className="text-2xl sm:text-3xl font-black text-red-500">4 Servers</span>
            <span className="text-[10px] text-gray-400 block mt-2">Multi-fallback fallback mode</span>
          </div>

          <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 shadow-lg">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1">
              Today&apos;s Streams

            </span>
            <span className="text-2xl sm:text-3xl font-black text-white">8,920</span>
            <span className="text-[10px] text-emerald-400 block mt-2">+14% vs yesterday</span>
          </div>

          <div className="bg-[#1c1c1c] border border-white/10 rounded-xl p-5 shadow-lg">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider block mb-1">
              Saved Watchlists
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white">1,430</span>
            <span className="text-[10px] text-gray-400 block mt-2">Local storage synced</span>
          </div>
        </div>

        {/* Custom Episode CMS Form */}
        <div className="bg-[#1a1a1a] rounded-xl p-6 sm:p-8 border border-white/10 shadow-2xl">
          <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
            <span>⚙️</span> Custom Video Source Manager
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
                Anime ID (MAL ID)
              </label>
              <input
                type="text"
                value={animeId}
                onChange={(e) => setAnimeId(e.target.value)}
                placeholder="e.g. 5114"
                className="w-full bg-[#242424] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 border border-white/10 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
                Episode Number
              </label>
              <input
                type="number"
                value={episodeNumber}
                onChange={(e) => setEpisodeNumber(parseInt(e.target.value) || 1)}
                min="1"
                className="w-full bg-[#242424] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 border border-white/10 text-sm"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase text-gray-400 mb-2">
              Episode Title (Optional)
            </label>
            <input
              type="text"
              value={episodeTitle}
              onChange={(e) => setEpisodeTitle(e.target.value)}
              placeholder="e.g. The Beginning"
              className="w-full bg-[#242424] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 border border-white/10 text-sm"
            />
          </div>

          <div className="mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-semibold uppercase text-gray-400">
                Streaming Servers (HLS / M3U8)
              </label>
              <button
                onClick={addServer}
                className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-md text-xs font-bold transition"
              >
                + Add Server
              </button>
            </div>

            {servers.map((server, index) => (
              <div key={index} className="bg-[#242424] p-4 rounded-lg border border-white/5 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={server.server}
                    onChange={(e) =>
                      updateServer(index, "server", e.target.value)
                    }
                    placeholder="Server name (e.g. HD Server 1)"
                    className="bg-[#1a1a1a] text-white px-3 py-2 rounded-md focus:outline-none text-xs border border-white/10"
                  />
                  <input
                    type="text"
                    value={server.url}
                    onChange={(e) => updateServer(index, "url", e.target.value)}
                    placeholder="Direct HLS / M3U8 Stream URL"
                    className="bg-[#1a1a1a] text-white px-3 py-2 rounded-md focus:outline-none text-xs border border-white/10"
                  />
                </div>
                {servers.length > 1 && (
                  <button
                    onClick={() => removeServer(index)}
                    className="text-red-400 hover:text-red-300 text-xs font-medium"
                  >
                    Remove Server
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition shadow-lg text-sm"
            >
              Save Episode Stream
            </button>
            <button
              onClick={loadEpisodes}
              className="bg-[#2a2a2a] hover:bg-[#333333] text-white px-6 py-3 rounded-lg font-semibold transition text-sm border border-white/10"
            >
              Inspect Sources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

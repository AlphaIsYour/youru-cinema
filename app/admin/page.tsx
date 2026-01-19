// app/admin/page.tsx
"use client";

import { useState } from "react";
import {
  saveEpisodeData,
  getAnimeEpisodes,
  VideoSource,
} from "@/app/lib/videoSources";

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
      alert("Anime ID dan Episode Number wajib diisi!");
      return;
    }

    const validSources = servers.filter((s) => s.url.trim() !== "");

    if (validSources.length === 0) {
      alert("Minimal 1 server harus diisi!");
      return;
    }

    saveEpisodeData({
      animeId,
      episodeNumber,
      title: episodeTitle || `Episode ${episodeNumber}`,
      sources: validSources,
    });

    alert("Episode berhasil disimpan!");

    setEpisodeNumber(episodeNumber + 1);
    setEpisodeTitle("");
    setServers([{ server: "Server 1", url: "" }]);
  };

  const loadEpisodes = () => {
    if (!animeId) {
      alert("Masukkan Anime ID dulu!");
      return;
    }

    const episodes = getAnimeEpisodes(animeId);
    console.log("Episodes for", animeId, ":", episodes);
    alert(`Found ${episodes.length} episodes. Check console for details.`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-4 sm:px-6 lg:px-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Admin - Manage Episodes</h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Anime ID (MAL ID)
              </label>
              <input
                type="text"
                value={animeId}
                onChange={(e) => setAnimeId(e.target.value)}
                placeholder="e.g., 5114"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Episode Number
              </label>
              <input
                type="number"
                value={episodeNumber}
                onChange={(e) => setEpisodeNumber(parseInt(e.target.value))}
                min="1"
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Episode Title (Optional)
            </label>
            <input
              type="text"
              value={episodeTitle}
              onChange={(e) => setEpisodeTitle(e.target.value)}
              placeholder="e.g., The Beginning"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Video Sources</label>
              <button
                onClick={addServer}
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm"
              >
                + Add Server
              </button>
            </div>

            {servers.map((server, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-md mb-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={server.server}
                    onChange={(e) =>
                      updateServer(index, "server", e.target.value)
                    }
                    placeholder="Server name"
                    className="bg-gray-600 text-white px-3 py-2 rounded-md focus:outline-none"
                  />
                  <input
                    type="text"
                    value={server.url}
                    onChange={(e) => updateServer(index, "url", e.target.value)}
                    placeholder="Video URL"
                    className="bg-gray-600 text-white px-3 py-2 rounded-md focus:outline-none"
                  />
                </div>
                {servers.length > 1 && (
                  <button
                    onClick={() => removeServer(index)}
                    className="mt-2 text-red-500 hover:text-red-400 text-sm"
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
              className="flex-1 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-md font-semibold"
            >
              Save Episode
            </button>
            <button
              onClick={loadEpisodes}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-md font-semibold"
            >
              Load Episodes
            </button>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Masukkan MAL ID anime (lihat di URL detail anime)</li>
            <li>Tentukan nomor episode</li>
            <li>Tambahkan minimal 1 server video source</li>
            <li>Klik Save Episode</li>
            <li>Data akan tersimpan di browser localStorage</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

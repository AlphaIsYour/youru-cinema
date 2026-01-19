"use client";

import { useEffect, useState } from "react";
import StreamingPlayer from "./StreamingPlayer";
import { saveWatchHistory } from "@/app/lib/watchHistory";

interface WatchPlayerProps {
  animeSlug: string;
  episodeNumber: number;
  animeTitle: string;
  thumbnail: string;
  hasTrailer?: boolean;
  trailerUrl?: string;
}

interface VideoData {
  sources: Array<{ url: string; quality: string; isM3U8: boolean }>;
  subtitles?: Array<{ url: string; lang: string; label: string }>;
}

export default function WatchPlayer({
  animeSlug,
  episodeNumber,
  animeTitle,
  thumbnail,
}: WatchPlayerProps) {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    const savedProgress = localStorage.getItem(
      `watch-progress-${animeSlug}-${episodeNumber}`,
    );
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setStartTime(progress.currentTime || 0);
    }

    fetchVideoData();
  }, [animeSlug, episodeNumber, animeTitle]);

  const fetchVideoData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🎬 Fetching video:", animeTitle, "Episode", episodeNumber);

      const response = await fetch(
        `/api/video?title=${encodeURIComponent(animeTitle)}&episode=${episodeNumber}`,
      );

      console.log("📡 API Response:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("📦 Data received:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.sources || data.sources.length === 0) {
        throw new Error("No video sources available");
      }

      console.log("✅ Video sources loaded:", data.sources.length);
      setVideoData(data);
    } catch (err) {
      console.error("❌ Video fetch error:", err);
      setError(err instanceof Error ? err.message : "Failed to load video");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    if (Math.floor(currentTime) % 5 === 0 && duration > 0) {
      localStorage.setItem(
        `watch-progress-${animeSlug}-${episodeNumber}`,
        JSON.stringify({ currentTime, duration }),
      );

      saveWatchHistory({
        animeId: animeSlug,
        animeTitle: animeTitle,
        episodeNumber: episodeNumber,
        thumbnail,
        watchedAt: Date.now(),
        progress: currentTime,
        duration: duration,
      });
    }
  };

  const handleVideoEnded = () => {
    localStorage.removeItem(`watch-progress-${animeSlug}-${episodeNumber}`);

    // Get last saved duration from localStorage
    const savedProgress = localStorage.getItem(
      `watch-progress-${animeSlug}-${episodeNumber}`,
    );

    let totalDuration = 0;
    if (savedProgress) {
      const data = JSON.parse(savedProgress);
      totalDuration = data.duration || 0;
    }

    saveWatchHistory({
      animeId: animeSlug,
      animeTitle: animeTitle,
      episodeNumber: episodeNumber,
      thumbnail,
      watchedAt: Date.now(),
      progress: totalDuration,
      duration: totalDuration,
    });
  };

  if (loading) {
    return (
      <div className="w-full aspect-video bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-white text-sm font-light">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full aspect-video bg-black flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          <svg
            className="w-20 h-20 text-red-500 mb-4 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-white text-xl font-bold mb-2">
            Video Not Available
          </h3>
          <p className="text-gray-400 text-sm mb-6">{error}</p>
          <button
            onClick={fetchVideoData}
            className="px-6 py-3 bg-white text-black rounded font-bold hover:bg-white/90 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!videoData) {
    return null;
  }

  return (
    <StreamingPlayer
      sources={videoData.sources}
      subtitles={videoData.subtitles}
      poster={thumbnail}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleVideoEnded}
      startTime={startTime}
    />
  );
}

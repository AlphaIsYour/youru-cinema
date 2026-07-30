// app/components/StreamingPlayer.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import Link from "next/link";
import { showToast } from "@/app/components/ToastContainer";

interface StreamingPlayerProps {
  sources: Array<{ url: string; quality: string; isM3U8: boolean }>;
  subtitles?: Array<{ url: string; lang: string; label: string }>;
  poster?: string;
  animeTitle?: string;
  episodeNumber?: number;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  startTime?: number;
}

export default function StreamingPlayer({
  sources,
  subtitles = [],
  poster,
  animeTitle = "Anime Series",
  episodeNumber = 1,
  onEnded,
  onTimeUpdate,
  startTime = 0,
}: StreamingPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [currentQuality, setCurrentQuality] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [pauseDuration, setPauseDuration] = useState(0);
  const [audioSubModalOpen, setAudioSubModalOpen] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState("Japanese (Original)");
  const [selectedSub, setSelectedSub] = useState("Indonesian (Softsub)");

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoplayCountdown = useCallback(() => {
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          onEnded?.();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [onEnded]);

  // Track Pause > 3s Idle Timer
  useEffect(() => {
    if (!isPlaying && currentTime > 0) {
      pauseTimerRef.current = setInterval(() => {
        setPauseDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setPauseDuration(0);
      if (pauseTimerRef.current) clearInterval(pauseTimerRef.current);
    }
    return () => {
      if (pauseTimerRef.current) clearInterval(pauseTimerRef.current);
    };
  }, [isPlaying, currentTime]);

  // Initialize HLS player
  useEffect(() => {
    const video = videoRef.current;
    if (!video || sources.length === 0) return;

    const source = sources[currentQuality];

    if (hlsRef.current) {
      hlsRef.current.destroy();
    }

    if (source.isM3U8 && Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(source.url);
      hls.attachMedia(video);
      hlsRef.current = hls;
    } else {
      video.src = source.url;
      if (startTime > 0) video.currentTime = startTime;
    }

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [sources, currentQuality, startTime]);

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      onTimeUpdate?.(video.currentTime, video.duration);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) startAutoplayCountdown();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [onEnded, onTimeUpdate, startAutoplayCountdown]);

  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    setShowControls(true);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const skipSeconds = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), duration);
    showToast(`${seconds > 0 ? "+5s" : "-5s"}`, "info");
  };

  const handleVolumeChange = (newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;
    setVolume(newVolume);
    video.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isMuted) {
      video.volume = volume;
      setIsMuted(false);
    } else {
      video.volume = 0;
      setIsMuted(true);
    }
  };

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handlePlaybackRateChange = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleFullscreen = () => {
    const videoContainer = videoRef.current?.parentElement;
    if (!videoContainer) return;
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="relative w-full aspect-video bg-black group overflow-hidden select-none"
      onMouseMove={resetControlsTimeout}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        onClick={togglePlay}
        playsInline
      >
        {subtitles.map((subtitle, index) => (
          <track
            key={index}
            kind="subtitles"
            src={subtitle.url}
            srcLang={subtitle.lang}
            label={subtitle.label}
          />
        ))}
      </video>

      {/* Top Header Bar (Back button, Title, Episode) */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/40 to-transparent flex items-center justify-between z-30 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/20 transition hover:scale-110"
            title="Back to Home"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div>
            <h2 className="text-white text-sm sm:text-base font-bold drop-shadow">{animeTitle}</h2>
            <span className="text-gray-300 text-xs font-light">Episode {episodeNumber}</span>
          </div>
        </div>

        <button
          onClick={() => showToast("Report submitted to YourU Engineers", "info")}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-black/50 border border-white/20 px-3 py-1 rounded-full transition"
          title="Report Video Issue"
        >
          <span>🚩</span>
          <span className="hidden sm:inline">Report</span>
        </button>
      </div>

      {/* PAUSE > 3S AUTOMATIC OVERLAY (Synopsis & Details Display) */}
      {!isPlaying && pauseDuration >= 3 && countdown === null && (
        <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col justify-end p-6 sm:p-12 z-20 animate-fadeIn text-white pointer-events-none">
          <div className="max-w-xl space-y-3 pointer-events-auto">
            <div className="flex items-center gap-2">
              <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                Paused
              </span>
              <span className="text-green-400 font-bold text-xs">98% Match</span>
              <span className="border border-gray-500 px-1 py-0.5 text-[10px] text-gray-300 font-semibold rounded-sm">
                16+
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black">{animeTitle}</h2>
            <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed line-clamp-3">
              Currently playing Episode {episodeNumber}. Press Spacebar or click Play to resume watching.
            </p>
          </div>
        </div>
      )}

      {/* Autoplay Next Episode Countdown Overlay */}
      {countdown !== null && (
        <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center z-50 animate-fadeIn text-white p-6">
          <div className="text-center max-w-sm">
            <span className="text-xs uppercase tracking-widest text-red-500 font-bold mb-2 block">
              Up Next
            </span>
            <h3 className="text-2xl font-black mb-4">Playing Next Episode</h3>
            <div className="w-20 h-20 rounded-full border-4 border-red-600 flex items-center justify-center text-3xl font-bold mb-6 mx-auto animate-pulse">
              {countdown}s
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setCountdown(null);
                  onEnded?.();
                }}
                className="px-6 py-2.5 bg-white text-black font-bold text-sm rounded hover:bg-gray-200 transition"
              >
                Play Now
              </button>
              <button
                onClick={() => setCountdown(null)}
                className="px-6 py-2.5 bg-gray-800 text-white font-medium text-sm rounded hover:bg-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Center Play/Pause & Skip Buttons */}
      {!isPlaying && countdown === null && pauseDuration < 3 && (
        <div className="absolute inset-0 flex items-center justify-center gap-6 z-20">
          <button
            onClick={() => skipSeconds(-5)}
            className="w-12 h-12 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/20 transition hover:scale-110"
            title="Rewind 5s"
          >
            -5s
          </button>

          <button
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-all duration-200 shadow-2xl hover:scale-110"
          >
            <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>

          <button
            onClick={() => skipSeconds(5)}
            className="w-12 h-12 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center border border-white/20 transition hover:scale-110"
            title="Forward 5s"
          >
            +5s
          </button>
        </div>
      )}

      {/* Audio & Subtitle Selector Modal Dropdown */}
      {audioSubModalOpen && (
        <div className="absolute right-6 bottom-20 bg-[#181818] border border-white/20 rounded-xl p-5 z-50 text-xs w-72 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-white text-sm">Audio & Subtitles</span>
            <button onClick={() => setAudioSubModalOpen(false)} className="text-gray-400 hover:text-white">✕</button>
          </div>

          <div className="space-y-2">
            <span className="text-gray-400 font-bold uppercase text-[10px] block">Audio</span>
            {["Japanese (Original)", "English Dub", "Indonesian Dub"].map((aud) => (
              <button
                key={aud}
                onClick={() => {
                  setSelectedAudio(aud);
                  showToast(`Audio set to ${aud}`, "info");
                }}
                className={`w-full text-left px-3 py-1.5 rounded transition ${
                  selectedAudio === aud ? "bg-red-600 text-white font-bold" : "text-gray-300 hover:bg-white/10"
                }`}
              >
                {aud}
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-white/10">
            <span className="text-gray-400 font-bold uppercase text-[10px] block">Subtitles</span>
            {["Indonesian (Softsub)", "English (CC)", "Off"].map((sub) => (
              <button
                key={sub}
                onClick={() => {
                  setSelectedSub(sub);
                  showToast(`Subtitles set to ${sub}`, "info");
                }}
                className={`w-full text-left px-3 py-1.5 rounded transition ${
                  selectedSub === sub ? "bg-red-600 text-white font-bold" : "text-gray-300 hover:bg-white/10"
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Player Controls Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 sm:p-6 transition-opacity duration-300 z-30 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="mb-3">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={(e) => handleSeek(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-600"
          />
        </div>

        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={togglePlay} className="text-white hover:text-gray-300 transition">
              {isPlaying ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button onClick={() => skipSeconds(-5)} className="text-gray-300 hover:text-white font-bold text-xs">
              -5s
            </button>
            <button onClick={() => skipSeconds(5)} className="text-gray-300 hover:text-white font-bold text-xs">
              +5s
            </button>

            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="text-white hover:text-gray-300 transition">
                {isMuted || volume === 0 ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 sm:w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            <span className="text-white text-xs font-light">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Audio & Subtitle Selector Button */}
            <button
              onClick={() => setAudioSubModalOpen(!audioSubModalOpen)}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded border border-white/20 flex items-center gap-1"
              title="Audio & Subtitles"
            >
              <span>💬</span>
              <span className="hidden sm:inline">Audio & Sub</span>
            </button>

            {/* Speed Selector */}
            <select
              value={playbackRate}
              onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
              className="bg-black/60 text-white text-xs px-2 py-1 rounded border border-white/20 focus:outline-none"
            >
              <option value={0.5}>0.5x</option>
              <option value={1.0}>1.0x</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2.0}>2.0x</option>
            </select>

            {sources.length > 1 && (
              <select
                value={currentQuality}
                onChange={(e) => setCurrentQuality(parseInt(e.target.value))}
                className="bg-black/50 text-white text-xs px-2 py-1 rounded border border-white/20 focus:outline-none"
              >
                {sources.map((source, index) => (
                  <option key={index} value={index}>
                    {source.quality}
                  </option>
                ))}
              </select>
            )}

            <button onClick={toggleFullscreen} className="text-white hover:text-gray-300 transition">
              {isFullscreen ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

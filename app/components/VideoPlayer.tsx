// app/components/VideoPlayer.tsx
"use client"; // INI WAJIB! Menandakan ini adalah Client Component

import ReactPlayer from "react-player/lazy";

type VideoPlayerProps = {
  url: string;
};

const VideoPlayer = ({ url }: VideoPlayerProps) => {
  return (
    <div className="relative aspect-video w-full">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls={true}
        // Opsi tambahan untuk pengalaman lebih baik
        playing={true} // Opsional: auto play
        light={false} // Opsional: jangan tampilkan thumbnail, langsung player
        pip={true} // Picture-in-Picture
      />
    </div>
  );
};

export default VideoPlayer;

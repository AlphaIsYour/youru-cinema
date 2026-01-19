// app/components/VideoPlayer.tsx
"use client";

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
        playing={true}
        light={false}
        pip={true}
      />
    </div>
  );
};

export default VideoPlayer;

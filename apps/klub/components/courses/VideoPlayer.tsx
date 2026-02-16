// @ts-nocheck
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Play } from "lucide-react";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
      <div className="animate-pulse text-slate-600">Ladowanie playera...</div>
    </div>
  ),
});

interface VideoPlayerProps {
  url: string;
  onEnded?: () => void;
}

export function VideoPlayer({ url, onEnded }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        playing={playing}
        controls
        onReady={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          onEnded?.();
        }}
      />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Play className="h-12 w-12 text-slate-600" />
        </div>
      )}
    </div>
  );
}

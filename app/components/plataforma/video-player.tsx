"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;

interface VideoPlayerProps {
  materialId: number;
}

export function VideoPlayer({ materialId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const src = `${UPLOAD_HOST}/api/control-escolar/materiales/${materialId}/hls/`;

    // Safari has native HLS support
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
      return;
    }

    if (!Hls.isSupported()) return;

    const hls = new Hls({
      xhrSetup(xhr) {
        xhr.withCredentials = true;
      },
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
      startLevel: -1,
    });

    hls.loadSource(src);
    hls.attachMedia(video);

    hls.on(Hls.Events.ERROR, (_event, data) => {
      if (data.fatal) hls.destroy();
    });

    hlsRef.current = hls;

    return () => hls.destroy();
  }, [materialId]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full"
      style={{ maxHeight: "540px", background: "#000" }}
    />
  );
}
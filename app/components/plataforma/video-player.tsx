"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

const UPLOAD_HOST = process.env.NEXT_PUBLIC_UPLOAD_HOST;

interface VideoPlayerProps {
  materialId: number;
  programaId?: string;
}

export function VideoPlayer({ materialId, programaId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const src = `${UPLOAD_HOST}/api/control-escolar/materiales/${materialId}/hls/?programa=${programaId}`;
    const streamSrc = `${UPLOAD_HOST}/api/control-escolar/materiales/${materialId}/stream/?programa=${programaId}`;

    // HLS.js takes priority (Chrome, Firefox). Safari has real native HLS.
    if (!Hls.isSupported()) {
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = src;
      } else {
        video.src = streamSrc;
      }
      return;
    }

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
      if (data.fatal || data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        hls.destroy();
        video.src = streamSrc;
        video.load();
      }
    });

    hlsRef.current = hls;

    return () => hls.destroy();
  }, [materialId, programaId]);

  return (
    <video
      ref={videoRef}
      controls
      className="w-full"
      style={{ maxHeight: "540px", background: "#000" }}
    />
  );
}

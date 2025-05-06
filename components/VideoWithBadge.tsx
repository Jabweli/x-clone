"use client"
import IKVideo from "@/components/IKVideo"; // adjust path as needed
import { useRef, useEffect, useState } from "react";

export default function VideoWithBadge({ path, isSensitive }: { path: string; isSensitive?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState<string>("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      const totalSeconds = Math.floor(video.duration);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      setDuration(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <IKVideo
        path={path}
        className={`${isSensitive ? "blur-lg" : ""} w-full h-full object-cover`}
        showControls={false}
        ref={videoRef}
      />
      {duration && (
        <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-3 py-1 rounded">
          {duration}
        </span>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

interface Track {
  name: string;
  artist: string;
  image: string;
  url: string;
  isPlaying?: boolean;
  progressMs?: number;
  durationMs?: number;
}

export default function CurrentlyPlaying() {
  const [track, setTrack] = useState<Track | null>(null);
  const [live, setLive] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const pickFallback = async () => {
      try {
        const res = await fetch("/api/spotify/top-tracks", { cache: "no-store" });
        const data = await res.json();
        const tracks: Track[] = data.tracks ?? [];
        if (!cancelled && tracks.length) {
          setTrack(tracks[Math.floor(Math.random() * Math.min(tracks.length, 10))]);
          setLive(false);
        }
      } catch {
        if (!cancelled) setTrack(null);
      }
    };

    const fetchTrack = async () => {
      if (document.hidden) return;
      try {
        const res = await fetch("/api/spotify/currently-playing", {
          cache: "no-store",
        });
        const data = await res.json();
        const playing = data.currentlyPlaying;

        if (!cancelled && playing?.isPlaying) {
          setTrack(playing);
          setProgress(playing.progressMs ?? 0);
          setLive(true);
        } else if (!cancelled) {
          setLive(false);
          if (!track) void pickFallback();
        }
      } catch {
        if (!cancelled) void pickFallback();
      }
    };

    void fetchTrack();
    const interval = setInterval(() => void fetchTrack(), 20000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!live || !track?.durationMs) return;
    const tick = setInterval(() => {
      setProgress((p) => Math.min(p + 1000, track.durationMs ?? 0));
    }, 1000);
    return () => clearInterval(tick);
  }, [live, track]);

  if (!track) return null;

  const pct = track.durationMs ? (progress / track.durationMs) * 100 : 0;

  return (
    <a
      href={track.url}
      target="_blank"
      rel="noopener noreferrer"
      className="row group flex items-center gap-4 py-3"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={track.image}
        alt=""
        className={`h-11 w-11 shrink-0 rounded-full object-cover ${
          live ? "animate-spin-slow" : ""
        }`}
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {live && (
            <span className="flex h-3 items-end gap-[2px]">
              <span className="eq-bar h-3 w-[2px] rounded-full bg-accent" />
              <span className="eq-bar h-3 w-[2px] rounded-full bg-accent" />
              <span className="eq-bar h-3 w-[2px] rounded-full bg-accent" />
            </span>
          )}
          <span className="aside text-faint">
            {live ? "now playing" : "on repeat lately"}
          </span>
        </div>

        <p className="mt-1 truncate text-[15px]">
          {track.name}{" "}
          <span className="text-faint">— {track.artist}</span>
        </p>

        {live && (
          <span className="mt-2 block h-px w-full bg-rule">
            <span
              className="block h-px bg-ink/40 transition-[width] duration-1000 ease-linear"
              style={{ width: `${pct}%` }}
            />
          </span>
        )}
      </div>
    </a>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import ExpandableCard from "@/components/landing/ExpandableCard";
import { Button } from "@/components/ui/button";
import { Music, X } from "lucide-react";

interface CurrentlyPlaying {
    name: string;
    artist: string;
    album: string;
    image: string;
    url: string;
    id: string;
    isPlaying: boolean;
    progressMs: number;
    durationMs: number;
    timestamp: number;
}

export default function CurrentlyPlaying() {
    const [currentlyPlaying, setCurrentlyPlaying] = useState<CurrentlyPlaying | null>(null);
    const [localProgress, setLocalProgress] = useState(0);
    const [isRevealed, setIsRevealed] = useState(false);
    const [initialCheckDone, setInitialCheckDone] = useState(false);

    const pollingInterval = useRef<NodeJS.Timeout | null>(null);
    const progressInterval = useRef<NodeJS.Timeout | null>(null);

    const fetchCurrentlyPlaying = async () => {
        try {
            const res = await fetch("/api/spotify/currently-playing", {
                method: "GET",
                cache: "no-store"
            });
            const data = await res.json();

            if (data.currentlyPlaying) {
                setCurrentlyPlaying(data.currentlyPlaying);
                setLocalProgress(data.currentlyPlaying.progressMs);
            } else {
                setCurrentlyPlaying(null);
                setLocalProgress(0);
            }
        } catch (error) {
            console.error("Error fetching currently playing:", error);
            setCurrentlyPlaying(null);
            setLocalProgress(0);
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchCurrentlyPlaying();
            setInitialCheckDone(true);
        };
        void init();
    }, []);

    useEffect(() => {
        if (!isRevealed) {
            // Cleanup intervals if not revealed
            if (pollingInterval.current) clearInterval(pollingInterval.current);
            if (progressInterval.current) clearInterval(progressInterval.current);
            return;
        }

        void fetchCurrentlyPlaying(); // Immediate update on reveal
        pollingInterval.current = setInterval(() => {
            void fetchCurrentlyPlaying();
        }, 5000);

        return () => {
            if (pollingInterval.current) clearInterval(pollingInterval.current);
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, [isRevealed]);

    useEffect(() => {
        if (!currentlyPlaying || !currentlyPlaying.isPlaying || !isRevealed) {
            if (progressInterval.current) clearInterval(progressInterval.current);
            return;
        }

        progressInterval.current = setInterval(() => {
            setLocalProgress(prev => {
                const newProgress = prev + 1000;
                return newProgress > currentlyPlaying.durationMs
                    ? currentlyPlaying.durationMs
                    : newProgress;
            });
        }, 1000);

        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, [currentlyPlaying, isRevealed]);

    useEffect(() => {
        if (!isRevealed) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (pollingInterval.current) clearInterval(pollingInterval.current);
                if (progressInterval.current) clearInterval(progressInterval.current);
            } else {
                void fetchCurrentlyPlaying();
                pollingInterval.current = setInterval(() => {
                    void fetchCurrentlyPlaying();
                }, 5000);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [isRevealed]);

    if (!initialCheckDone) return null;

    if (!currentlyPlaying && !isRevealed) return null;

    if (!isRevealed) {
        return (
            <div className="mb-4">
                <Button
                    variant="outline"
                    className="w-full justify-between bg-transparent border-foreground/20 hover:bg-muted/50 text-muted-foreground transition-all group"
                    onClick={() => setIsRevealed(true)}
                >
                    <span className="flex items-center gap-2">
                        <Music className="w-4 h-4" />
                        <span className="text-xs font-medium"><span className="text-foreground group-hover:text-foreground transition-colors">live: </span>listening now</span>
                    </span>
                    <span className="text-[10px] tracking-wider font-bold opacity-60 group-hover:opacity-100 transition-opacity group-hover:text-foreground">
                        ?
                    </span>
                </Button>
            </div>
        );
    }

    if (!currentlyPlaying && isRevealed) {
         return (
            <div className="mb-4 bg-transparent border border-foreground/20 p-4 text-center">
                 <p className="text-sm text-muted-foreground mb-2">session ended or paused</p>
                 <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsRevealed(false)}
                    className="text-xs"
                >
                    close
                </Button>
            </div>
         );
    }

    if (!currentlyPlaying) return null;

    return (
        <div className="relative">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    {currentlyPlaying.isPlaying ? (
                        <div className="w-2 h-2 bg-foreground animate-pulse"/>
                    ) : (
                        <div className="w-2 h-2 bg-muted-foreground"/>
                    )}
                    <span className="text-sm font-medium text-foreground">
                        {currentlyPlaying.isPlaying ? "Currently Playing" : "Paused"}
                    </span>
                </div>
                <button
                    onClick={() => setIsRevealed(false)}
                    className="text-muted-foreground/50 hover:text-foreground transition-colors p-1 hover:bg-muted/50"
                    title="Hide player"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <img
                    src={currentlyPlaying.image}
                    alt={currentlyPlaying.album}
                    className="w-16 h-16"
                />
                <div className="flex-1 min-w-0">
                    <a
                        href={currentlyPlaying.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                    >
                        <p className="font-medium text-sm truncate group-hover:text-muted-foreground transition-colors">
                            {currentlyPlaying.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {currentlyPlaying.artist}
                        </p>
                    </a>
                    <div className="mt-2 w-full bg-muted h-1 overflow-hidden">
                        <div
                            className="bg-foreground h-1 ease-linear transition-all duration-1000"
                            style={{
                                width: `${Math.min((localProgress / currentlyPlaying.durationMs) * 100, 100)}%`
                            }}
                        />
                    </div>
                    <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>{formatTime(localProgress)}</span>
                        <span>{formatTime(currentlyPlaying.durationMs)}</span>
                    </div>
                </div>
            </div>
            <ExpandableCard title={<span className="text-sm italic text-muted-foreground/80">fun fact</span>}>
                currently, this site is hosted on vercel, which doesn&apos;t support websockets due to its serverless
                nature.
                as a result, i&apos;m actually polling from every client (when you expand this player!), pulling updates from spotify every 5 seconds.
                <br/>
                <br/>
                if you do the math, i&apos;d hit spotify&apos;s rate limits at ~25 concurrent users ...
            </ExpandableCard>
        </div>
    );
}

function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

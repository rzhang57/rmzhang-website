"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        if (!currentlyPlaying || !currentlyPlaying.isPlaying) {
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
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
            if (progressInterval.current) {
                clearInterval(progressInterval.current);
            }
        };
    }, [currentlyPlaying]);

    const startPolling = () => {
        void fetchCurrentlyPlaying();
        pollingInterval.current = setInterval(() => {
            void fetchCurrentlyPlaying();
        }, 5000);
    };

    const stopPolling = () => {
        if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
        }
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
            progressInterval.current = null;
        }
    };

    useEffect(() => {
        startPolling();

        return () => {
            stopPolling();
        };
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                stopPolling();
            } else {
                startPolling();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    if (!currentlyPlaying) {
        return null;
    }

    return (
        <>
            <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-2">
                    {currentlyPlaying.isPlaying ? (
                        <div className="w-2 h-2 bg-[#1db954] animate-pulse"/>
                    ) : (
                        <div className="w-2 h-2 bg-gray-400"/>
                    )}
                    <span className="text-sm font-medium text-[#1db954]">
                    {currentlyPlaying.isPlaying ? "Currently Playing" : "Paused"}
                </span>
                </div>
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
                        className="block"
                    >
                        <p className="font-medium text-sm truncate hover:text-[#1db954] transition-colors">
                            {currentlyPlaying.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                            {currentlyPlaying.artist}
                        </p>
                    </a>
                    <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 h-1">
                        <div
                            className="bg-[#1db954] h-1 ease-linear"
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
        </>
    );
}

function formatTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}
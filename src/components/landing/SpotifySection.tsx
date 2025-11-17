"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Track {
    name: string;
    artist: string;
    album: string;
    image: string;
    url: string;
    previewUrl: string | null;
    id: string;
    uri?: string;
}

export default function SpotifySection() {
    const [tracks, setTracks] = useState<Track[]>([]);
    const [loading, setLoading] = useState(true);
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);
    const [loadingIframe, setLoadingIframe] = useState<number | null>(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        fetch("/api/spotify/top-tracks", { method: "GET" })
            .then((res) => res.json())
            .then((data) => {
                const allTracks = data.tracks || [];
                const shuffled = [...allTracks].sort(() => 0.5 - Math.random());
                setTracks(shuffled.slice(0, 5));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const togglePlayer = (index: number) => {
        if (playingIndex === index) {
            setPlayingIndex(null);
            setLoadingIframe(null);
        } else {
            setPlayingIndex(index);
            setLoadingIframe(index);
        }
    };

    const handleIframeLoad = () => {
        setLoadingIframe(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#1db954] border-t-transparent"/>
            </div>
        );
    }

    return (
        <motion.div
            initial={{opacity: 0, y: 20}}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="md:text-2xl sm:text-lg font-bold tracking-tighter mb-4">
                songs
            </h2>
            <div className="font-light text-gray-500 pb-5">random selection of 5 songs i&apos;ve been listening to recently</div>
            <div className="grid gap-3">
                {tracks.map((track, index) => (
                    <div
                        key={index}
                        className="rounded-lg bg-muted/30 hover:bg-muted/50 transition-all overflow-hidden"
                    >
                        <div className="flex items-center gap-4 p-3 group cursor-pointer" onClick={() => togglePlayer(index)}>
                            <div className="relative flex-shrink-0">
                                <img
                                    src={track.image}
                                    alt={track.album}
                                    className="w-16 h-16 rounded"
                                />
                            </div>
                            <div className="flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                                <a
                                    href={track.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block"
                                >
                                    <p className="font-medium text-sm truncate hover:text-[#1db954] transition-colors">
                                        {track.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {track.artist}
                                    </p>
                                </a>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground italic">
                                    {playingIndex === index ? "close" : "listen"}
                                </span>
                                <svg
                                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                                        playingIndex === index ? "rotate-180" : ""
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        <AnimatePresence>
                            {playingIndex === index && (
                                <motion.div
                                    initial={{height: 0, opacity: 0}}
                                    animate={{height: 80, opacity: 1}}
                                    exit={{height: 0, opacity: 0}}
                                    transition={{duration: 0.3}}
                                    className="overflow-hidden"
                                >
                                    <div
                                        className="px-3 pb-3 relative"
                                        onMouseEnter={() => document.body.classList.add('hide-custom-cursor')}
                                        onMouseLeave={() => document.body.classList.remove('hide-custom-cursor')}
                                    >
                                        {loadingIframe === index && (
                                            <div className="absolute inset-0 flex items-center justify-center rounded z-10">
                                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#1db954] border-t-transparent" />
                                            </div>
                                        )}
                                        <iframe
                                            src={`https://open.spotify.com/embed/track/${track.id}?utm_source=generator&autoplay=1`}
                                            width="100%"
                                            height="80"
                                            frameBorder="0"
                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                            loading="eager"
                                            className="rounded"
                                            onLoad={handleIframeLoad}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
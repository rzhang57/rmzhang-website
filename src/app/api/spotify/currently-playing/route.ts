import { NextResponse } from "next/server";
import {getAccessToken} from "@/app/api/spotify/util";
import {SpotifyTrack} from "@/app/api/spotify/models";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const { access_token } = await getAccessToken();

        const response = await fetch(
            "https://api.spotify.com/v1/me/player/currently-playing",
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                cache: "no-store",
            }
        );

        // Handle 204 No Content - nothing is playing
        if (response.status === 204) {
            return NextResponse.json({
                currentlyPlaying: null,
                isPlaying: false
            });
        }

        if (!response.ok) {
            const error = await response.json();
            console.error("Spotify API error:", error);
            return NextResponse.json({
                currentlyPlaying: null,
                error: error.error
            }, { status: response.status });
        }

        const data = await response.json();

        const track = data.item;

        if (!track) {
            return NextResponse.json({
                currentlyPlaying: null,
                isPlaying: false
            });
        }

        const currentlyPlaying = {
            name: track.name,
            artist: track.artists.map((a: { name: any; }) => a.name).join(", "),
            album: track.album.name,
            image: track.album.images[0]?.url,
            url: track.external_urls.spotify,
            previewUrl: track.preview_url,
            id: track.id,
            uri: track.uri,
            isPlaying: data.is_playing,
            progressMs: data.progress_ms,
            durationMs: track.duration_ms,
            timestamp: data.timestamp,
        };

        return NextResponse.json({ currentlyPlaying });
    } catch (error) {
        console.error("Spotify API error:", error);
        return NextResponse.json({
            currentlyPlaying: null,
            error: "Failed to fetch currently playing track"
        }, { status: 500 });
    }
}
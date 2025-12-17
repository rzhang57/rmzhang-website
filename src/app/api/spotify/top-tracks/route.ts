import { NextResponse } from "next/server";
import {getAccessToken, SpotifyTrack} from "@/app/api/spotify/util";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const { access_token } = await getAccessToken();

        const response = await fetch(
            "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50",
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            const error = await response.json();
            console.error("Spotify API error:", error);
            return NextResponse.json({ tracks: [], error: error.error }, { status: response.status });
        }

        const data = await response.json();

        const tracks = data.items.map((track: SpotifyTrack) => ({
            name: track.name,
            artist: track.artists.map((a) => a.name).join(", "),
            album: track.album.name,
            image: track.album.images[0]?.url,
            url: track.external_urls.spotify,
            previewUrl: track.preview_url,
            id: track.id,
            uri: track.uri,
        }));

        return NextResponse.json({ tracks });
    } catch (error) {
        console.error("Spotify API error:", error);
        return NextResponse.json({ tracks: [], error: "Failed to fetch tracks" }, { status: 500 });
    }
}
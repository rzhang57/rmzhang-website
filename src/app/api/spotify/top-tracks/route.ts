import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

async function getAccessToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: REFRESH_TOKEN!,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Token refresh failed:", data);
        throw new Error("Failed to refresh token");
    }

    return data;
}

export async function GET() {
    try {
        const { access_token } = await getAccessToken();

        const response = await fetch(
            "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=45",
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

        const tracks = data.items.map((track: any) => ({
            name: track.name,
            artist: track.artists.map((a: any) => a.name).join(", "),
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
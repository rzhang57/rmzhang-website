const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

interface SpotifyArtist {
    name: string;
}

interface SpotifyAlbum {
    name: string;
    images: { url: string }[];
}

interface SpotifyTrack {
    name: string;
    artists: SpotifyArtist[];
    album: SpotifyAlbum;
    external_urls: { spotify: string };
    preview_url: string | null;
    id: string;
    uri: string;
}

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

export { getAccessToken };
export type { SpotifyArtist, SpotifyAlbum, SpotifyTrack };
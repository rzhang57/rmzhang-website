import SpotifySection from "@/components/landing/About/SpotifySection";

export default function MusicSection() {
    return (
        <>
            <h2 className="md:text-2xl sm:text-lg font-bold tracking-tighter mb-4">
                songs
            </h2>
            <SpotifySection/>
        </>
    );
}
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AnimatedBackground from "@/components/AnimatedBackground";
import Header from "@/components/landing/Header";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ryanz.dev"),
  title: {
    default: "ryan zhang",
    template: "%s — ryan zhang",
  },
  description: "cs student at ubc. software engineer.",
  openGraph: {
    title: "ryan zhang",
    description: "cs student at ubc. software engineer.",
    url: "https://ryanz.dev",
    images: [{ url: "/statics/pfp.png", alt: "ryan zhang" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans`}>
        <AnimatedBackground />
        <div className="mx-auto flex min-h-screen w-full max-w-column flex-col px-6 sm:px-8">
          <Header />
          <main className="flex-1 pb-24">{children}</main>
        </div>
      </body>
    </html>
  );
}

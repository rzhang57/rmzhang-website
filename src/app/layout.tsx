import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ryan zhang",
  description: "developer; cs student at ubc",
  openGraph: {
    images: [
      {
        url: "https://ryanz.dev/statics/pfp.png",
        alt: "pfp",
      },
    ],
  },
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
      <body
          className={`${geistMono.variable} font-mono antialiased`}
      >
          <ThemeProvider>
            <CustomCursor />
            {children}
          </ThemeProvider>
      </body>
      </html>
  );
}

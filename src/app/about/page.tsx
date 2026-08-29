import type { Metadata } from "next";
import About from "@/components/landing/About/About";

export const metadata: Metadata = { title: "about" };

export default function AboutPage() {
  return <About />;
}

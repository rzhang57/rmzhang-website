import type { Metadata } from "next";
import HobbiesSection from "@/components/landing/About/HobbiesSection";

export const metadata: Metadata = { title: "hobbies" };

export default function HobbiesPage() {
  return <HobbiesSection />;
}

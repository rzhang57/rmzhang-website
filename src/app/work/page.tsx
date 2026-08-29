import type { Metadata } from "next";
import WorkSection from "@/components/landing/About/WorkSection";

export const metadata: Metadata = { title: "work" };

export default function WorkPage() {
  return <WorkSection />;
}

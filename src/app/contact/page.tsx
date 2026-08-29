import type { Metadata } from "next";
import Contact from "@/components/landing/Contact";

export const metadata: Metadata = { title: "contact" };

export default function ContactPage() {
  return <Contact />;
}

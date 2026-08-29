import type { Metadata } from "next";
import Projects from "@/components/landing/Projects";

export const metadata: Metadata = { title: "projects" };

export default function ProjectsPage() {
  return <Projects />;
}

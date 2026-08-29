import Nav from "@/components/landing/Nav";
import Penguin from "@/components/landing/Penguin";

const routes = [
  { href: "/about", label: "about" },
  { href: "/work", label: "work" },
  { href: "/projects", label: "projects" },
  { href: "/hobbies", label: "hobbies" },
  { href: "/contact", label: "contact" },
];

export default function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-10">
      <Penguin />
      <Nav routes={routes} />
    </header>
  );
}

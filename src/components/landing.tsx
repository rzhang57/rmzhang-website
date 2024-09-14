"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useState} from "react";
import Confetti from "react-confetti";
import useWindowSize from 'react-use/lib/useWindowSize'
import ProjectCard from "@/components/ProjectCard";


export default function Landing() {
  const [recycleConfetti, setRecycleConfetti] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize()

  function handleNameClick() {
    setShowConfetti(true);
    setRecycleConfetti(true);

    setTimeout(() => setRecycleConfetti(false), 500);


  }

  return (
      <>
        {showConfetti && <Confetti width={width} height={height} recycle={recycleConfetti} numberOfPieces={100} />}
        <div className="flex flex-col min-h-[100dvh] justify-center mx-auto items-center">
          <header
              className="px-6 py-6 h-14 flex items-center justify-between w-full sticky top-0 bg-gray-50 rounded-full max-w-xl ">

            <nav className="flex gap-4 sm:gap-6 items-center">
              <NavLink href={"#home"} label={"home"}/>
              <NavLink href={"#about"} label={"about"}/>
              <NavLink href={"#projects"} label={"projects"}/>
              <NavLink href={"#contact"} label={"contact"}/>

            </nav>
            <div className="flex gap-3 justify-between items-center ml-auto">
              <a href={"https://linkedin.com/in/rmzhang"} target="_blank">
                <Avatar className="size-8">
                  <AvatarImage
                      src={"https://media.discordapp.net/attachments/786838952664498180/1284024159411900436/pngegg_1.png?ex=66e5202f&is=66e3ceaf&hm=94a56ef9d30a84bd5a0c3a1f8fa4ca5b02cd3ca4373eca7fae1fddecfb5b81c1&=&format=webp&quality=lossless&width=864&height=864"}/>
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </a>

              <a href={"https://github.com/rzhang57"} target="_blank">
                <Avatar>
                  <AvatarImage
                      src={"https://media.discordapp.net/attachments/786838952664498180/1284022725534421043/pngegg.png?ex=66e51ed9&is=66e3cd59&hm=81cfc19ed6f7bd77c70bcfc7d63b46d6799fcbe0da92956e287ebc1e3859970a&=&format=webp&quality=lossless&width=864&height=864"}/>
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </a>
            </div>


          </header>

          <main className="flex-col space-y-96 mx-auto  w-full px-6 items-center max-w-5xl">
            <section id="home" className="w-full py-12 md:py-24 lg:py-32 xl:py-48 my-1000px">

              <div className="space-y-2 text-center">
                <h1
                    onClick={handleNameClick}
                    className="inline-block group relative font-bold tracking-tighter sm:text-5xl lg:text-6xl py-4">
                  Ryan Zhang
                  <span
                      className="block absolute bottom-0 left-0 w-0 h-[5px] bg-pink-200 transition-all duration-500 group-hover:w-full"></span>
                </h1>
                <p className="text-muted-foreground md:text-xl text-center self-center tracking-tighter">
                  Second year computer science student at UBC.
                </p>
              </div>


            </section>

            <section id="about" className="flex flex-col space-y-5 w-full py-12 md:py-24 lg:py-32 xl:py-48">
              <div className="flex justify-center">
                <h1 className="text-3xl font-extrabold tracking-tighter">
                  About me
                </h1>
              </div>

              <div className="flex justify-center">
                <div className="grid lg:grid-cols-[1fr_3fr] sm:grid-cols-1 items-center">
                  <Avatar className="lg:w-48 lg:h-48 sm:w-32 sm:h-32 md:w-32 md:w-32 m-auto">
                    <AvatarImage
                        src="https://cdn.discordapp.com/attachments/786838952664498180/1282125364050657383/2022-11-08_W221108-0230_hires_retouched_profile2.jpg?ex=66e4cf4b&is=66e37dcb&hm=6c5139f7d241556bfdd6a0175d4f682f5ff7943b1bf6ed50db51d1ea378e2a71&"/>
                    <AvatarFallback>My face</AvatarFallback>
                  </Avatar>
                  <p className="inline-block text-muted-foreground md:text-xl sm:text-md flex-1 tracking-tighter">
                    Hey 👋! My name is Ryan, I&apos;m a second year Computer Science student, and I&apos;m currently
                    working as an
                    Undergraduate Computer Science Teaching Assistant at UBC in the course, CPSC 110. I&apos;ve been a
                    Java
                    developer
                    since high school and I love building things, learning, and having fun along the way! Outside of
                    software,
                    I&apos;m big into Formula 1 and English Football. I&apos;m happy to connect, and always open to
                    chat!
                  </p>
                </div>

              </div>
            </section>

            <section id="projects" className="flex flex-col space-y-5 w-full py-12 md:py-24 lg:py-32 xl:py-48">
              <h1 className="text-3xl font-extrabold tracking-tighter">
                Projects
              </h1>
              <div className="grid lg:grid-cols-[1fr_1fr] sm:grid-cols-1 items-center gap-4">
                <ProjectCard title={"Ride Rater"} date={"July 2024 - Present"}
                             technologies={["ReactJS", "Java Spring Boot", "PostgreSQL", "Docker"]}
                             description={"Rate rides"}/>
                <ProjectCard title={"Kumon Homework Grader"} date={"June 2024 - Present"}
                             technologies={["Tensorflow", "Keras", "Flask", "Next.js", "PostgreSQL"]}
                             description={"Homework grading automation"}/>
              </div>

            </section>

            <section id={"contact"} className="flex flex-col space-y-5 w-full py-12 md:py-24 lg:py-32 xl:py-48">
              <div className="flex justify-center m-0">
                <h1 className="text-3xl font-extrabold tracking-tighter">
                  Contact
                </h1>
              </div>

              <div className="flex justify-center m-0">
                <div className="grid grid-cols-[1fr_6fr] items-center">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                        src="https://cdn.discordapp.com/attachments/786838952664498180/1284045847918542919/image-removebg-preview.png?ex=66e53462&is=66e3e2e2&hm=8977bdea6e80551567dce923f6b9732ca4537e34d01c23a2ee9e4fd55cf41d81&"/>
                    <AvatarFallback>Avatar</AvatarFallback>
                  </Avatar>
                  <p className="inline-block text-muted-foreground md:text-lg flex-1">
                    Inquires? Email me at rmzhang@student.ubc.ca!
                  </p>
                </div>
              </div>

            </section>
          </main>

        </div>
      </>
  )

  function NavLink({href, label}: { href: string; label: string }) {
    return (
        <a href={href} className="relative group text-sm font-medium text-gray-900">
          {label}

          <span
              className="block absolute bottom-0 left-0 w-0 h-[2px] bg-pink-200 transition-all duration-500 group-hover:w-full"></span>
        </a>
    );
  }

}

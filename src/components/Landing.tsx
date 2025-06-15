"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useState} from "react";
import Confetti from "react-confetti";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";

export default function Landing() {
  const [recycleConfetti, setRecycleConfetti] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [imageSrc, setImageSrc] = useState("/statics/myface.jpg");

  function handleNameClick() {
    setShowConfetti(true);
    setRecycleConfetti(true);

    setTimeout(() => setRecycleConfetti(false), 500);
  }

  function NavLink({href, label}: { href: string; label: string }) {
    return (
        <a href={href} className="relative group tracking-tighter text-sm font-medium text-gray-900 transition-all hover:tracking-tight">
          {label}
          <span
              className="block absolute bottom-0 left-0 w-0 h-[2px] bg-pink-200 transition-all duration-500 group-hover:w-full"></span>
        </a>
    );
  }

  function LinkCustom({href, label}: { href: string; label: string }) {
    return (
        <a href={href} className="text-blue-500 md:text-xl sm:text-md flex-1 transition-all tracking-tighter hover:tracking-tight relative group" target={"_blank"}>
          {label}
          <span
              className="block absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-500 group-hover:w-full"></span>
        </a>
    );
  }

  function handleCopyClick() {
    const textToCopy = 'rmzhang@student.ubc.ca';
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
          // Optionally, provide feedback to the user
          alert('Text copied to clipboard!');
        })
        .catch((err) => {
          console.error('Failed to copy text: ', err);
        });
  };

  function handleImageClick() {
    setImageSrc((prevSrc) =>
        prevSrc === "/statics/myface.jpg" ? "/statics/otherimage.png" : "/statics/myface.jpg"
    );
  }

  return (
      <>
        <div id={"home"} className="flex flex-col min-h-[100dvh] justify-center mx-auto items-center dynbg">
          {showConfetti && <Confetti width={window.innerWidth-17} height={window.innerHeight+100} recycle={recycleConfetti} numberOfPieces={100} />}
          <header
              className="px-6 py-6 h-14 flex items-center justify-between w-full sticky top-0 bg-gray-50 rounded-full max-w-xl z-10 bg-opacity-0 backdrop-blur-md">

            <nav className="flex gap-4 sm:gap-6 items-center">
              <NavLink href={"#home"} label={"home"}/>
              <NavLink href={"#about"} label={"about"}/>
              <NavLink href={"#projects"} label={"projects"}/>
              <NavLink href={"#contact"} label={"contact"}/>

            </nav>
            <div className="flex gap-3 justify-between items-center ml-auto">
              <a href={"https://linkedin.com/in/rmzhang"} target="_blank">
                <Avatar className="size-8 scale-100 hover:scale-110 transition-all">
                  <AvatarImage
                      src={"/statics/inlogo.png"}/>
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </a>

              <a href={"https://github.com/rzhang57"} target="_blank">
                <Avatar className="scale-100 hover:scale-110 transition-all">
                  <AvatarImage
                      src={"/statics/gitlogo.png"}/>
                  <AvatarFallback></AvatarFallback>
                </Avatar>
              </a>
            </div>
          </header>

          <main className="flex-col space-y-96 mx-auto w-full px-6 items-center max-w-5xl">
            <section className="w-full py-12 sm:py-0 md:py-24 lg:py-32 xl:py-48 my-1000px">

              <div className="space-y-2 text-center">
                <h1
                    onClick={handleNameClick}
                    className="group relative font-bold tracking-tighter hover:tracking-normal transition-all text-6xl py-4 duration-1000 hover:cursor-pointer">
                  Ryan Zhang
                </h1>
                <div
                    className="inline text-muted-foreground md:text-3xl text-center self-center tracking-tighter leading-relaxed">
                  Software Engineer Intern @
                  <Link
                      href="https://www.planview.com/"
                      target="_blank"
                      className="inline-block transition-all duration-100 font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent hover:brightness-125 hover:cursor-pointer px-1"
                  >
                    Planview
                  </Link>
                </div>
              </div>


            </section>

            <section id="about" className="flex flex-col space-y-5 w-full py-12 md:py-24 lg:py-32 xl:py-48">
              <div className="flex">
                <h1 className="md:text-3xl sm:text-xl font-extrabold tracking-tighter text-left">
                  Who am I?
                </h1>
              </div>

              <div className="flex justify-center">
                <div className="grid lg:grid-cols-[3fr_1fr] sm:grid-cols-1 items-center">

                  <p className="inline-block text-muted-foreground md:text-xl sm:text-sm flex-1 tracking-tighter">
                    Hey 👋! My name is Ryan, I&apos;m a second year Computer Science student, (prev) a CS Teaching assistant at
                    UBC, and a Software Engineer at Planview working on Copilot.
                    I&apos;ve been a passionate developer since high school, previously competing in the FIRST Tech
                    Challenge robotics competition alongside
                    team 16031,
                    <> </>
                    <LinkCustom href={"https://ftc-events.firstinspires.org/team/16031"} label={"Parabellum"}/>
                    , where we won the provincial Championship (2x) in BC and a Judges&apos; Award at the 2022 FTC World
                    Championships in Houston, Texas.
                    <br/>
                    I&apos;ve always loved building things, learning, solving problems, and having fun along the way!
                    Outside of software, robotics, and engineering, I&apos;m big into Formula 1, English Football, cars,
                    video editing, keyboards, and FPS games.
                    <br/>
                    Feel free to connect by email or LinkedIn, I&apos;m always happy to chat!
                  </p>
                  <Avatar className="md:w-48 md:h-48 sm:h-32 sm:w-32 m-auto scale-105 hover:scale-110 transition-all my-2">
                    <div onClick={handleImageClick} className={"cursor-pointer"}>
                      <AvatarImage src={imageSrc}/>
                    </div>
                  </Avatar>
                </div>
              </div>
            </section>

            <section id="projects" className="flex flex-col space-y-5 w-full py-12 md:py-24 lg:py-32 xl:py-48">
              <h1 className="text-3xl font-extrabold tracking-tighter">
                Currently busy working on...
              </h1>
              <div className="grid lg:grid-cols-[1fr_1fr] sm:grid-cols-1 items-stretch gap-4">
                <ProjectCard title={"Planview Copilot"} date={"Jan 2024 - Present"}
                             technologies={["React", "Java Spring Boot", "PostgreSQL", "AWS", "Docker"]}
                             description={"Full stack web development and messing with LLMs"} githubLink={"https://www.planview.com/ai/"}/>
                <ProjectCard title={"Ride Rater"} date={"Jul 2024 - Present"}
                             technologies={["React", "Java Spring Boot", "PostgreSQL", "Docker"]}
                             description={"Full stack app that allows real riders to rate rides at various amusement parks"} githubLink={"https://github.com/rzhang57/riderater"}/>
                <ProjectCard title={"Kumon Homework Grader"} date={"Jun 2024 - Present"}
                             technologies={["Tensorflow", "Keras", "Flask", "React", "PostgreSQL", "OpenCV"]}
                             description={"Homework grading automation using OpenCV and Keras model trained on real student's handwriting"}/>
                <ProjectCard title={"Portfolio Website"} date={"Sept 2024"}
                             technologies={["Typescript", "Next.js"]}
                             description={"My personal portfolio website - about me and what I'm working on"}
                             githubLink={"https://github.com/rzhang57/rmzhang-website"}/>
                <ProjectCard title={"Braille + English Translator"} date={"Sept 2024"}
                             technologies={["Python"]}
                             description={"Command line application that translates Braille to English and vice versa"}
                             githubLink={"https://github.com/rzhang57/eng-intern-challenge"}/>
                <ProjectCard title={"Exam Preparer"} date={"Jan 2024 - Apr 2024"}
                             technologies={["Java", "Java Swing", "JUnit"]}
                             description={"Desktop application that helps users prepare for exams by storing practice problems and notes"}
                             githubLink={"https://github.com/rzhang57/exam-preparer"}/>
                <ProjectCard title={"Robot"} date={"Sept 2018 - Apr 2023"}
                             technologies={["Java", "Fusion 360"]}
                             description={"Competition spec robot designed for FTC over the span of 4 years, winning 2 provincial titles, and 1 international award"}
                             githubLink={"https://ftc-events.firstinspires.org/team/16031"}/>
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
                        src="/statics/pfp.png"/>
                    <AvatarFallback>Me</AvatarFallback>
                  </Avatar>
                  <p className="inline-block text-muted-foreground md:text-lg flex-1">
                    Inquiries? Email me at:
                    <> </>
                    <a onClick={handleCopyClick} className={"underline tracking-tight hover:tracking-normal hover:cursor-pointer transition-all hover:text-pink-200"}>rmzhang@student.ubc.ca</a>
                  </p>
                </div>
              </div>

            </section>
          </main>

        </div>
      </>
  )
}

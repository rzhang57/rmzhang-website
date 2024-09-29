"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useState} from "react";
import Confetti from "react-confetti";
import useWindowSize from 'react-use/lib/useWindowSize'
import ProjectCard from "@/components/ProjectCard";
import {motion} from "framer-motion"


export default function Landing() {
  const [recycleConfetti, setRecycleConfetti] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize()

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
        <a href={href} className="text-blue-300 md:text-xl sm:text-md flex-1 transition-all tracking-tighter hover:tracking-tight relative group" target={"_blank"}>
          {label}
          <span
              className="block absolute bottom-0 left-0 w-0 h-[2px] bg-blue-300 transition-all duration-500 group-hover:w-full"></span>
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

  return (
      <>
        {showConfetti && <Confetti width={width} height={height} recycle={recycleConfetti} numberOfPieces={100} />}
        <div id={"home"} className="flex flex-col min-h-[100dvh] justify-center mx-auto items-center">
          <header
              className="px-6 py-6 h-14 flex items-center justify-between w-full sticky top-0 bg-gray-50 rounded-full max-w-xl z-10 bg-opacity-70 backdrop-blur-md">

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

          <main className="flex-col space-y-96 mx-auto  w-full px-6 items-center max-w-5xl">
            <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 my-1000px">

              <div className="space-y-2 text-center">
                <h1
                    onClick={handleNameClick}
                    className="group relative font-bold tracking-tighter hover:tracking-normal transition-all sm:text-5xl lg:text-6xl py-4 duration-1000 hover:cursor-pointer">
                  Ryan Zhang
                  <span
                      className="block absolute bottom-0 left-0 w-0 h-[5px] bg-gray-200 transition-all duration-1000 group-hover:w-full"></span>
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
                  <Avatar className="lg:w-48 lg:h-48 sm:w-32 sm:h-32 md:w-32 md:w-32 m-auto hover:scale-105 transition-transform my-2">
                    <AvatarImage src={"/statics/myface.jpg"}/>
                    <AvatarFallback>My face</AvatarFallback>
                  </Avatar>
                  <p className="inline-block text-muted-foreground md:text-xl sm:text-md flex-1 transition-all tracking-tighter hover:tracking-tight">
                    Hey 👋! My name is Ryan, I&apos;m a second year Computer Science student, and I&apos;m currently
                    working as an Undergraduate Computer Science Teaching Assistant at UBC for the course, CPSC 110.
                    <br/>
                    <br/>
                    I&apos;ve been a Java developer since high school and previously competed in the FIRST Tech Challenge robotics competition alongside
                    team 16031,
                    <> </>
                    <LinkCustom href={"https://ftc-events.firstinspires.org/team/16031"} label={"Parabellum"}/>
                    , where we won the provincial Championship (2x) in BC and a Judges&apos; Award at the 2022 FTC World Championships in Houston, Texas.
                    <br/>
                    <br/>
                    I&apos;ve always loved building things, learning, and having fun along the way! Outside of software, robotics, and engineering, I&apos;m big into Formula 1, English Football, cars, video editing, and games. I&apos;m happy to connect, and always open to chat!
                  </p>
                </div>

              </div>
            </section>

            <section id="projects" className="flex flex-col space-y-5 w-full py-12 md:py-24 lg:py-32 xl:py-48">
              <h1 className="text-3xl font-extrabold tracking-tighter">
                What I've been working on
              </h1>
              <div className="grid lg:grid-cols-[1fr_1fr] sm:grid-cols-1 items-stretch gap-4">
                <ProjectCard title={"Ride Rater"} date={"Jul 2024 - Present"}
                             technologies={["ReactJS", "Java Spring Boot", "PostgreSQL", "Docker"]}
                             description={"Full stack app that allows real riders to rate rides at various amusement parks"} githubLink={"https://github.com/rzhang57/riderater"}/>
                <ProjectCard title={"Kumon Homework Grader"} date={"Jun 2024 - Present"}
                             technologies={["Tensorflow", "Keras", "Flask", "React", "PostgreSQL", "OpenCV"]}
                             description={"Homework grading automation using OpenCV and Keras model trained on real student's handwriting"}/>
                <ProjectCard title={"Portfolio website (this!)"} date={"Sept 2024"}
                             technologies={["Typescript", "Next.js"]}
                             description={"My personal portfolio website - about me and what I'm working on"}
                             githubLink={"https://github.com/rzhang57/rmzhang-website"}/>
                <ProjectCard title={"Braille/ English Translator"} date={"Sept 2024"}
                             technologies={["Python"]}
                             description={"Command line application that translates Braille to English and vice versa"}
                             githubLink={"https://github.com/rzhang57/eng-intern-challenge"}/>
                <ProjectCard title={"Exam preparer"} date={"Jan 2024 - Apr 2024"}
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
                    Inquires? Email me at:
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

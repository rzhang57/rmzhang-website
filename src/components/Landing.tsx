"use client";

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {useState} from "react";
import Confetti from "react-confetti";
import ProjectCard from "@/components/ProjectCard";
import Link from "next/link";

export default function Landing() {
  const aboutMeNormal = (
      <p className="inline-block text-muted-foreground md:text-xl sm:text-sm flex-1 tracking-tighter">
          hey 👋! i&apos;m ryan, a third year cs student and ta @ ubc, and a software engineer intern at planview working
          on <LinkCustom href={"https://www.planview.com/ai"} label={"copilot"}/>, a multi-agent ai assistant
          integrated into planview&apos;s software product suite!
          i&apos;m incredibly passionate about building robust and efficient systems that make a difference,
          solving tough problems, learning fast, and having fun along the way!
          <br/>
          <br/>
          otherwise, i&apos;m also into f1, english football (liverpool supporter), sports cars, video
          editing, mechanical keyboards (topre), and games. <span className="text-red-500">click my face (on the right)</span> to read
          more about the things i'm into!
          <br/>
          <br/>
          feel free to connect, i&apos;m always down for a good chat. thanks for visiting, talk soon!
      </p>
  )
    const aboutHobbies = (
        <p className="inline-block text-muted-foreground md:text-xl sm:text-sm flex-1 tracking-tighter">
          more about my hobbies:
          <br/>
          <br/>
          <span className="font-bold">f1:</span> i love the cross section of engineering, sport, and speed.
          unfortunately, i support ferarri.
          <br/>
          <br/>
          <span className="font-bold">football:</span> i follow the premier league, and european football in general. i
          support liverpool (rip jota ❤️). i also follow international competitions.
          <br/>
          <br/>
          <span className="font-bold">sports cars:</span> i hope to own and maintain a clean nb or nc miata in the near future. into cars in general though.
          <br/>
          <br/>
          <span className="font-bold">video editing :</span> vegas pro user since 2018. made montages, school projects,
          funny short-form videos, and more.
          <br/>
          <br/>
          <span className="font-bold">mechanical keyboards:</span> i primarily use a realforce r3s with topre switches which i purchased from japan. i have a few other custom boards with more traditional cherry style switches, both soldered and hot-swappable.
          <br/>
          <br/>
          <span className="font-bold">games:</span> currently enjoying valorant, peak with friends, gta v while waiting for gta vi. previously played overwatch, fortnite, minecraft, fifa, f1.
      </p>
  )
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
        <a href={href}
           className="relative group tracking-tighter text-sm font-medium text-gray-900 transition-all hover:tracking-tight">
          {label}
          <span
              className="block absolute bottom-0 left-0 w-0 h-[2px] bg-pink-200 transition-all duration-500 group-hover:w-full"></span>
        </a>
    );
  }

  function LinkCustom({href, label}: { href: string; label: string }) {
    return (
        <a href={href}
           className="text-blue-700 md:text-xl sm:text-md flex-1 transition-all tracking-tighter hover:tracking-tight relative group"
           target={"_blank"}>
          {label}
          <span
              className="block absolute bottom-0 left-0 w-0 h-[2px] bg-blue-500 transition-all duration-500 group-hover:w-full"></span>
        </a>
    );
  }

  function handleCopyClick() {
    const textToCopy = 'rmzhang@student.ubc.ca';
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
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
              className="w-full sticky top-0 bg-gray-50 bg-opacity-0 z-10">
            <div className="px-6 py-6 h-14 flex items-center justify-between max-w-xl mx-auto">
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
            </div>

          </header>

          <main className="flex-col space-y-96 mx-auto w-full px-6 items-center max-w-5xl">
            <section className="w-full py-12 sm:py-0 md:py-24 lg:py-32 xl:py-48 mb-96">

              <div className="space-y-2 text-center">
                <h1
                    onClick={handleNameClick}
                    className="group relative font-bold tracking-tighter hover:tracking-normal transition-all text-6xl py-4 duration-1000 hover:cursor-pointer">
                  ryan zhang
                </h1>
                <div
                    className="inline text-muted-foreground md:text-3xl text-center self-center tracking-tighter leading-relaxed">
                  software engineer coop at{'  '}
                  <Link
                      href="https://www.planview.com/"
                      target="_blank"
                      className="inline-block transition-all duration-100 font-bold bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent hover:brightness-125 hover:cursor-pointer px-1 pl-0"
                  >
                    planview
                  </Link>
                </div>
              </div>


            </section>

            <section id="about" className="flex flex-col space-y-5 w-full py-12 md:py-24 lg:py-32 xl:py-48 mb-48">
              <div className="flex">
                <h1 className="md:text-3xl sm:text-xl font-extrabold tracking-tighter text-left">
                  who am i?
                </h1>
              </div>

              <div className="flex justify-center">
                <div className="grid lg:grid-cols-[3fr_1fr] sm:grid-cols-1 items-center">
                  {imageSrc === "/statics/myface.jpg" ? aboutMeNormal : aboutHobbies}
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
                probably busy working on...
              </h1>
              <div className="grid lg:grid-cols-[1fr_1fr] sm:grid-cols-1 items-stretch gap-4">
                <ProjectCard title={"planview copilot"} date={"jan 2024 - Present"}
                             technologies={["React", "Java Spring Boot", "PostgreSQL", "AWS", "Docker"]}
                             description={"full stack web development, messing with LLMs"} githubLink={"https://www.planview.com/ai/"}/>
                <ProjectCard title={"ride rater"} date={"jul 2024 - present"}
                             technologies={["React", "Java Spring Boot", "PostgreSQL", "Docker"]}
                             description={"full stack app that allows real riders to rate rides at various amusement parks"} githubLink={"https://github.com/rzhang57/riderater"}/>
                <ProjectCard title={"kumon homework grader"} date={"jun 2024 - present"}
                             technologies={["Tensorflow", "Keras", "Flask", "React", "PostgreSQL", "OpenCV"]}
                             description={"full-stack automated homework grading application built using opencv and keras handwriting model"}/>
                <ProjectCard title={"ryanz.dev (personal portfolio)"} date={"sept 2024 - present"}
                             technologies={["Typescript", "Next.js"]}
                             description={"about me and what i'm working on"}
                             githubLink={"https://github.com/rzhang57/rmzhang-website"}/>
                <ProjectCard title={"two-way braille/ english translator"} date={"sept 2024"}
                             technologies={["Python"]}
                             description={"cli program that translates braille to english and vice versa"}
                             githubLink={"https://github.com/rzhang57/eng-intern-challenge"}/>
                <ProjectCard title={"exam preparer"} date={"jan 2024 - apr 2024"}
                             technologies={["Java", "Java Swing", "JUnit"]}
                             description={"desktop application that helps users prepare for exams by storing practice problems and notes"}
                             githubLink={"https://github.com/rzhang57/exam-preparer"}/>
                <ProjectCard title={"robot"} date={"sept 2018 - apr 2023"}
                             technologies={["Java", "Android Studio", "Fusion 360"]}
                             description={"competition spec robot designed for FTC (first tech challenge) over the span of 4 years, winning 2 provincial titles, and 1 global award"}
                             githubLink={"https://ftc-events.firstinspires.org/team/16031"}/>
              </div>

            </section>

            <section id={"contact"} className="flex flex-col space-y-5 w-full py-12 md:py-24 lg:py-32 xl:py-48 mb-48">
              <div className="flex justify-center m-0">
                <h1 className="text-3xl font-extrabold tracking-tighter">
                  contact me
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
                    inquiries? email me at:
                    <> </>
                    <a onClick={handleCopyClick} className={"underline tracking-tight hover:tracking-normal hover:cursor-pointer transition-all hover:text-pink-200"}>ryanzhang@outlook.com</a>
                  </p>
                </div>
              </div>

            </section>
          </main>

        </div>
      </>
  )
}

"use client";

import {JSX, SVGProps, useEffect, useState} from "react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"

export default function Landing() {


  // on render, animate? v
  //useEffect()

  return (
      <div className="flex flex-col min-h-[100dvh] max-w-5xl justify-center mx-auto items-center">
        <header className="px-6 h-14 flex items-center justify-between w-full sticky top-0">
          <nav className="flex gap-4 sm:gap-6 items-center">
            <Link href="#home" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
              home
            </Link>
            <Link href="#about" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
              about
            </Link>
            <Link href="#projects" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
              projects
            </Link>
            <Link href="#contact" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
              contact
            </Link>

          </nav>
          <Link
              href="https://linkedin.com/in/rmzhang"
              rel="noopener noreferrer"
              target="_blank"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
          >
            LinkedIn
          </Link>
        </header>
        <main className="flex-col space-y-96 mx-auto max-w-7xl w-full px-6 items-center ">


          <section id="home" className="w-full py-12 md:py-24 lg:py-32 xl:py-48 my-1000px">
            <div className="container">
              <div className="flex flex-col justify-center space-y-4 animate-fade-in">
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                </div>
                <div className="space-y-2 text-center">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none p-4">
                    Ryan Zhang
                  </h1>
                  <p className="text-muted-foreground md:text-xl text-center self-center">
                    Second year computer science student at UBC.
                  </p>
                </div>
              </div>
            </div>


          </section>

          <section id="about" className="flex flex-col space-y-5 w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <h1 className="text-3xl font-extrabold tracking-tighter">
              About me
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Hey 👋! My name is Ryan, I'm a second year Computer Science student, and I'm currently working as an
              Undergraduate Computer Science Teaching Assistant at UBC in the course, CPSC 110. I've been Java developer
              since high school and I love building things, learning, and having fun along the way! Outside of software,
              big into Formula 1 and English Football. I'm happy to connect, and always open to chat!
            </p>
          </section>

          <section id="projects" className="flex flex-col space-y-5 w-full py-12 md:py-24 lg:py-32 xl:py-48">
            <h1 className="text-3xl font-extrabold tracking-tighter">
              About me
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Hey 👋! My name is Ryan, I'm a second year Computer Science student, and I'm currently working as an
              Undergraduate Computer Science Teaching Assistant at UBC in the course, CPSC 110. I've been Java developer
              since high school and I love building things, learning, and having fun along the way! Outside of software,
              big into Formula 1 and English Football. I'm happy to connect, and always open to chat!
            </p>
          </section>
        </main>

      </div>
  )

}

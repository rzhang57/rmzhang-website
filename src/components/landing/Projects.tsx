"use client";

import ProjectCard from "@/components/ProjectCard";

export default function Projects() {
  return (
    <>
      <h1 className="text-3xl font-extrabold tracking-tighter">probably busy working on...</h1>
      <div className="grid lg:grid-cols-[1fr_1fr] sm:grid-cols-1 items-stretch gap-4">
        <ProjectCard
          title={"noteblock"}
          date={"june 2025 - present"}
          technologies={["Go", "React", "SQLite", "Electron", "Docker", "Ollama"]}
          description={"desktop note taking made intuitive"}
          githubLink={"https://github.com/rzhang57/noteblock"}
        />
        <ProjectCard
          title={"planview copilot"}
          date={"jan 2025 - aug 2025"}
          technologies={["React", "Java Spring Boot", "PostgreSQL", "AWS", "Docker"]}
          description={"applied ai full stack engineering on the copilot team"}
          githubLink={"https://www.planview.com/ai/"}
        />
        <ProjectCard
          title={"ride rater"}
          date={"jul 2024 - oct 2024"}
          technologies={["React", "Java Spring Boot", "PostgreSQL", "Docker"]}
          description={"full stack app that allows real riders to rate rides at various amusement parks"}
          githubLink={"https://github.com/rzhang57/riderater"}
        />
        <ProjectCard
          title={"kumon homework grader"}
          date={"jun 2024 - aug 2024"}
          technologies={["Tensorflow", "Keras", "Flask", "React", "PostgreSQL", "OpenCV"]}
          description={"full-stack automated homework grading application built using opencv and keras handwriting model"}
        />
        <ProjectCard
          title={"ryanz.dev"}
          date={"sept 2024 - present"}
          technologies={["Typescript", "Next.js"]}
          description={"all about me and what i'm working on"}
          githubLink={"https://github.com/rzhang57/rmzhang-website"}
        />
        <ProjectCard
          title={"two-way braille/ english translator"}
          date={"sept 2024"}
          technologies={["Python"]}
          description={"cli program that translates braille to english and vice versa"}
          githubLink={"https://github.com/rzhang57/eng-intern-challenge"}
        />
        <ProjectCard
          title={"exam preparer"}
          date={"jan 2024 - apr 2024"}
          technologies={["Java", "Java Swing", "JUnit"]}
          description={"desktop application that helps users prepare for exams by storing practice problems and notes"}
          githubLink={"https://github.com/rzhang57/exam-preparer"}
        />
        <ProjectCard
          title={"robot"}
          date={"sept 2018 - apr 2023"}
          technologies={["Java", "Android Studio", "Fusion 360"]}
          description={"competition spec robot designed for FTC (first tech challenge) over the span of 4 years, winning 2 provincial titles, and 1 global award"}
          githubLink={"https://ftc-events.firstinspires.org/team/16031"}
        />
      </div>
    </>
  );
}


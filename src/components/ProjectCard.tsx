"use client";

import React from "react";

interface ProjectCardProps {
    title: string;
    date: string;
    technologies: string[];
    description: string;
    githubLink?: string;
    liveDemoLink?: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
                                                     title,
                                                     date,
                                                     technologies,
                                                     description,
                                                     githubLink,
                                                     liveDemoLink,
                                                 }) => {
    return (
        <a href={githubLink} target="_blank" rel="noopener noreferrer">
            <div
                className="scale-100 bg-muted/30 hover:bg-muted/50 transition-all p-6 border border-foreground/10 duration-300 h-full hover:scale-105">
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{date}</p>
                <div className="mb-4">
                    {technologies.map((tech) => (
                        <span
                            key={tech}
                            className="inline-block border border-foreground/20 px-3 py-1 text-sm text-muted-foreground mr-2 mb-2"
                        >
            {tech}
          </span>
                    ))}
                </div>
                <p className="text-muted-foreground">{description}</p>
                {(githubLink || liveDemoLink) && (
                    <div className="mt-4">
                        {liveDemoLink && (
                            <a
                                href={liveDemoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-foreground transition-colors"
                            >
                                Live Demo
                            </a>
                        )}
                    </div>
                )}
            </div>
        </a>

    );
};

export default ProjectCard;

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
                className="bg-card border border-input p-6 rounded-none h-full transition-colors hover:bg-secondary">
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{date}</p>
                <div className="mb-4">
                    {technologies.map((tech) => (
                        <span
                            key={tech}
                            className="inline-block bg-muted border border-input rounded-none px-2 py-0.5 text-xs text-foreground mr-2 mb-2"
                        >
            {tech}
          </span>
                    ))}
                </div>
                <p className="text-gray-700 dark:text-gray-400">{description}</p>
                {(githubLink || liveDemoLink) && (
                    <div className="mt-4">
                        {liveDemoLink && (
                            <a
                                href={liveDemoLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-foreground underline underline-offset-2"
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
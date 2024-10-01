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
                className="bg-opacity-70 bg-white bg-gray-200 hover:bg-gray-50 transition-all rounded-3xl p-6 outline-none hover:outline-pink-100 duration-500 h-full">
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{date}</p>
                <div className="mb-4">
                    {technologies.map((tech) => (
                        <span
                            key={tech}
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm text-gray-700 mr-2 mb-2"
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
                                className="text-blue-500 hover:underline"
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
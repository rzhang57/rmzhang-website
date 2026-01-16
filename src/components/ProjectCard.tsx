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
            <div className="glass-subtle iridescent-border rounded-xl p-5 h-full transition-all duration-300 hover:scale-[1.02] hover:border-white/30 group">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-gray-900 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{date}</p>
                <div className="mb-3 flex flex-wrap gap-1.5">
                    {technologies.map((tech) => (
                        <span
                            key={tech}
                            className="glass-pill rounded-full px-2.5 py-0.5 text-xs text-gray-700 font-medium"
                        >
                            {tech}
                        </span>
                    ))}
                </div>
                <p className="text-gray-600 text-sm">{description}</p>
                {liveDemoLink && (
                    <div className="mt-3">
                        <a
                            href={liveDemoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                        >
                            Live Demo
                        </a>
                    </div>
                )}
            </div>
        </a>
    );
};

export default ProjectCard;

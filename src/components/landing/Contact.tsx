"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GlassCard from "@/components/ui/GlassCard";

export default function Contact() {
    const [copySuccess, setCopySuccess] = useState(false);
    const [copyError, setCopyError] = useState(false);

    function handleCopyClick() {
        const textToCopy = "ryanzhang@outlook.com";
        navigator.clipboard
            .writeText(textToCopy)
            .then(() => {
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
            })
            .catch(() => {
                setCopyError(true);
                setTimeout(() => setCopyError(false), 2000);
            });
    }

    return (
        <div className="relative">
            <GlassCard>
                <div className="flex justify-center mb-0">
                    <h1 className="text-3xl font-extrabold tracking-tighter">contact me</h1>
                </div>

                <div className="flex justify-center m-0">
                    <div className="grid grid-cols-[auto_1fr] items-center gap-4 max-w-2xl w-full">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src="/statics/pfp.png"/>
                            <AvatarFallback>Me</AvatarFallback>
                        </Avatar>
                        <p className="inline-block text-muted-foreground md:text-lg">
                            inquiries? email me at:
                            <> </>
                            <a
                                onClick={handleCopyClick}
                                className="underline hover:cursor-pointer"
                            >
                                ryanzhang@outlook.com
                            </a>{" "}
                            or find me on linkedin!
                        </p>
                    </div>
                </div>
            </GlassCard>

            {copySuccess && (
                <div className="absolute top-full mt-2 left-0 right-0 flex justify-center z-50">
                    <div className="bg-white border border-black text-black px-4 py-2">
                        Email copied to clipboard!
                    </div>
                </div>
            )}
            {copyError && (
                <div className="absolute top-full mt-2 left-0 right-0 flex justify-center z-50">
                    <div className="bg-white border border-black text-black px-4 py-2">
                        Failed to copy email
                    </div>
                </div>
            )}
        </div>
    );
}


"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    <>
      <div className="flex justify-center m-0">
        <h1 className="text-3xl font-extrabold tracking-tighter">contact me</h1>
      </div>

      <div className="flex justify-center m-0 relative">
        <div className="grid grid-cols-[1fr_6fr] items-center">
          <Avatar className="w-12 h-12">
            <AvatarImage src="/statics/pfp.png" />
            <AvatarFallback>Me</AvatarFallback>
          </Avatar>
          <p className="inline-block text-muted-foreground md:text-lg flex-1">
            inquiries? email me at:
            <> </>
            <a
              onClick={handleCopyClick}
              className={
                "underline tracking-tight hover:tracking-normal hover:cursor-pointer transition-all text-foreground hover:underline"
              }
            >
              ryanzhang@outlook.com
            </a>{" "}
            or find me on linkedin!
          </p>
        </div>

        {copySuccess && (
          <div className="absolute top-full mt-2 bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg shadow-lg animate-in fade-in-0 slide-in-from-top-2 duration-300">
            ✓ Email copied to clipboard!
          </div>
        )}

        {copyError && (
          <div className="absolute top-full mt-2 bg-neutral-900 text-white px-4 py-2 rounded-lg shadow-lg animate-in fade-in-0 slide-in-from-top-2 duration-300">
            ✗ Failed to copy email
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import { useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import LinkCustom from "@/components/landing/LinkCustom";
import ExpandableCard from "@/components/landing/ExpandableCard";
import contentData from "@/data/content.json";

export default function About() {
  const [imageSrc, setImageSrc] = useState("/statics/myface.jpg");
  const showHobbies = imageSrc !== "/statics/myface.jpg";

  function handleImageClick() {
    setImageSrc((prevSrc) =>
      prevSrc === "/statics/myface.jpg" ? "/statics/otherimage.png" : "/statics/myface.jpg"
    );
  }

  function goBackToProfessional() {
    setImageSrc("/statics/myface.jpg");
  }

  const aboutMeNormal = (
    <p className="inline-block text-muted-foreground md:text-xl sm:text-sm flex-1 tracking-tighter">
      {contentData.aboutMe.normal.intro}{" "}
      <LinkCustom
        href={contentData.aboutMe.normal.copilotLink.href}
        label={contentData.aboutMe.normal.copilotLink.label}
      />
      {contentData.aboutMe.normal.description}
      <br />
      <br />
      {contentData.aboutMe.normal.hobbiesIntro}{" "}
      <span className="text-pink-400">{contentData.aboutMe.normal.clickPrompt}</span>{" "}
      {contentData.aboutMe.normal.closing}
    </p>
  );

  const aboutHobbies = (
      <div className="flex-1">
          <div className="flex gap-4 mb-3">
              <h2 className="md:text-2xl sm:text-lg font-bold tracking-tighter">
                  {contentData.aboutMe.hobbies.title}
              </h2>
              <Button variant="ghost" size="sm" onClick={goBackToProfessional}
                      className="text-pink-500 hover:text-pink-600">
                  ← back
              </Button>
          </div>
          <div className="space-y-1">
              {contentData.aboutMe.hobbies.items.map((item, index) => (
                  <ExpandableCard key={index} title={item.category}>
                      {item.description}
                  </ExpandableCard>
              ))}
          </div>
      </div>
  );

    return (
        <>
            <div className="flex">
                <h1 className="md:text-3xl sm:text-xl font-extrabold tracking-tighter text-left">who am i?</h1>
            </div>

            <div className="flex justify-center">
                <div className="grid lg:grid-cols-[3fr_1fr] sm:grid-cols-1 items-center gap-4 w-full">
                    {showHobbies ? aboutHobbies : aboutMeNormal}
          <Avatar className="md:w-48 md:h-48 sm:h-32 sm:w-32 m-auto scale-105 hover:scale-110 transition-all my-2">
            <div onClick={handleImageClick} className="cursor-pointer">
              <AvatarImage src={imageSrc} />
            </div>
          </Avatar>
        </div>
      </div>
    </>
  );
}

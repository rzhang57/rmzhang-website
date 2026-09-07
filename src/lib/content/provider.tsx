"use client";

import { createContext, useContext } from "react";
import seed from "@/data/content.json";

type Content = typeof seed;

// the seed is the default, so any section rendered outside the provider still
// shows the committed content instead of blowing up.
const ContentContext = createContext<Content>(seed);

export function ContentProvider({
  content,
  children,
}: {
  content: Content;
  children: React.ReactNode;
}) {
  return (
    <ContentContext.Provider value={content}>{children}</ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}

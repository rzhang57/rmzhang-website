"use client";

import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About/About";
import Projects from "@/components/landing/Projects";
import Contact from "@/components/landing/Contact";

export default function Landing() {
    return (
        <>
            <div id="home">
                <div className="flex flex-col min-h-[100dvh] justify-center items-center pb-24">
                    <main className="flex-col mx-auto w-full px-6 items-center max-w-5xl">
                        <section className="w-full">
                            <Hero/>
                        </section>
                        <div className="hidden xl:block w-full">
                            <Header/>
                        </div>
                    </main>
                </div>
                <section id="about"
                         className="flex flex-col w-full pt-8 md:pt-10 lg:pt-12 max-w-7xl px-6 mx-auto scroll-mt-24">
                    <About/>
                </section>
                <section id="projects"
                         className="flex flex-col w-full pt-8 md:pt-10 lg:pt-12 mx-auto max-w-5xl px-6 scroll-mt-24">
                    <Projects/>
                </section>
                <section id="contact"
                         className="flex flex-col w-full pt-8 md:pt-10 lg:pt-12 mb-48 mx-auto max-w-5xl px-6 scroll-mt-24">
                    <Contact/>
                </section>
            </div>
        </>
    )
}
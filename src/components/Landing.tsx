"use client";

import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Projects from "@/components/landing/Projects";
import Contact from "@/components/landing/Contact";

export default function Landing() {
    return (
        <>
            <div id={"home"} className="flex flex-col min-h-[100dvh] justify-center mx-auto items-center dynbg pt-24">
                <Header/>

                <main className="flex-col space-y-96 mx-auto w-full px-6 items-center max-w-5xl">
                    <section className="w-full py-12 sm:py-0 md:py-24 lg:py-32 xl:py-48 mb-96">
                        <Hero/>
                    </section>
                </main>
                <section id="about"
                         className="flex flex-col space-y-5 w-full pt-10 md:pt-12 lg:pt-16 xl:pt-24 max-w-5xl">
                    <About/>
                </section>
                <section id="projects"
                         className="flex flex-col space-y-5 w-full pt-10 md:pt-12 lg:pt-16 xl:pt-24 mx-auto max-w-5xl">
                    <Projects/>
                </section>
                <section id="contact" className="flex flex-col space-y-5 w-full pt-10 md:pt-12 lg:pt-16 xl:pt-24 mb-96 mx-auto max-w-5xl">
                    <Contact/>
                </section>
            </div>
        </>
    )
}
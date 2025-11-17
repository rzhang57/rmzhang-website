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

                    <section id="about"
                             className="flex flex-col space-y-5 w-full py-12 md:py-24 lg:py-32 xl:py-48 mb-48">
                        <About/>
                    </section>

                    <section id="projects" className="flex flex-col space-y-5 w-full pt-12 md:pt-24 lg:pt-32 xl:pt-48 pb-10">
                        <Projects/>
                    </section>
                </main>
                <section id="contact" className="flex flex-col space-y-5 w-full px-6 mb-48 mx-auto max-w-5xl">
                    <Contact/>
                </section>
            </div>
        </>
    )
}
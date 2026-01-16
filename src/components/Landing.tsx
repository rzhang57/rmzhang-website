"use client";

import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About/About";
import Projects from "@/components/landing/Projects";
import Contact from "@/components/landing/Contact";
import GradientOrbs from "@/components/effects/GradientOrbs";
import NoiseOverlay from "@/components/effects/NoiseOverlay";
import { PanelProvider } from "@/components/navigation/PanelContext";
import PanelNavigator from "@/components/navigation/PanelNavigator";
import Panel from "@/components/navigation/Panel";
import PanelIndicator from "@/components/navigation/PanelIndicator";

export default function Landing() {
    return (
        <PanelProvider>
            <div className="dynbg min-h-screen w-screen overflow-hidden">
                {/* Background effects */}
                <GradientOrbs />
                <NoiseOverlay />

                {/* Floating navigation header */}
                <Header />

                {/* Horizontal panel navigation */}
                <PanelNavigator>
                    <Panel id="home">
                        <Hero />
                    </Panel>

                    <Panel id="about">
                        <About />
                    </Panel>

                    <Panel id="projects">
                        <Projects />
                    </Panel>

                    <Panel id="contact">
                        <Contact />
                    </Panel>
                </PanelNavigator>

                {/* Panel indicator dots */}
                <PanelIndicator />
            </div>
        </PanelProvider>
    );
}

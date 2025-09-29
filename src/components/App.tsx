"use client";

import Landing from "./Landing"
import {useEffect, useState} from "react";
import Head from "next/head";
import ReactGA from "react-ga4";

export default function App() {
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        ReactGA.initialize("G-T7HS5MGK42");
        window.addEventListener("load", () => {
            setIsLoading(false);
        });

        return () => window.removeEventListener("load", () => setIsLoading(false));
    }, []);

    return (
        <>
            <Head>
                <title>ryan m zhang</title>
                <meta name="description" content="about ryan zhang" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {isLoading ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-900"></div>
                </div>
            ) : (
                <Landing />
            )}
        </>
    );

}
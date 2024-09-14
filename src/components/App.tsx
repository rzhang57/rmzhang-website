"use client";

import Landing from "./Landing"
import {useEffect, useState} from "react";
import Head from "next/head";

export default function App() {
    const [isLoading, setIsLoading] = useState(false); // State to track if the site is loading


    useEffect(() => {
        // Wait for all assets, including images, to load
        window.addEventListener("load", () => {
            setIsLoading(false); // Hide loader when everything is loaded
        });

        // Cleanup listener when component unmounts
        return () => window.removeEventListener("load", () => setIsLoading(false));
    }, []);

    return (
        <>
            <Head>
                <title>ryan m zhang</title>
                <meta name="description" content="My global description" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {isLoading ? (
                // Show loading spinner when site is loading
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    ...
                </div>
            ) : (
                // Once loading is done, show the full site content
                <Landing />
            )}
        </>
    );

}
"use client";

import Landing from "./Landing"
import {useEffect, useState} from "react";
import Head from "next/head";

export default function App() {
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        window.addEventListener("load", () => {
            setIsLoading(false);
        });

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
                // TODO: make loading screen nicer than just ...
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    ...
                </div>
            ) : (
                <Landing />
            )}
        </>
    );

}
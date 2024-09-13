"use client";

import Landing from "./landing"
import {useEffect, useState} from "react";

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
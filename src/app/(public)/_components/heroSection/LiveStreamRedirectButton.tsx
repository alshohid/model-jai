
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";


const StartStreamingRedirect = () => {
    const router = useRouter();

    const handleRedirect = () => {
        router.push("/live-stream");
    };

    return (
        <div className="mt-5 flex justify-center">
            <StartStreamingButton onClick={handleRedirect}>
                Start Streaming
            </StartStreamingButton>
        </div>
    );
};

export default StartStreamingRedirect;
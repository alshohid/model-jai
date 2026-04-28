"use client";

import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { store } from "@/redux/store";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echoInstance: Echo<"reverb"> | null = null;

export function getEcho() {
  if (typeof window === "undefined") return null;

  const token = store.getState().auth.token;

  if (!token) return null;

  if (echoInstance) return echoInstance;

  window.Pusher = Pusher;

  echoInstance = new Echo({
    broadcaster: "reverb",
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY || "kroxn8vfslxcduiv5y5s",
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST || "127.0.0.1",
    wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT || 8080),
    wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT || 8080),
    forceTLS: (process.env.NEXT_PUBLIC_REVERB_SCHEME || "http") === "https",
    enabledTransports: ["wss"],
    disableStats: true,

    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  echoInstance.connector.pusher.connection.bind("connected", () => {
    console.log("Socket connected");
  });

  echoInstance.connector.pusher.connection.bind("error", (err: unknown) => {
    console.log("Socket connection error:", err);
  });

  echoInstance.connector.pusher.connection.bind("disconnected", () => {
    console.log("Socket disconnected");
  });

  return echoInstance;
}

export function disconnectEcho() {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}

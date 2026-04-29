"use client";

import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { store } from "@/redux/store";
import { logRealtimeConnection } from "@/shared/lib/realtimeDebug";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echoInstance: Echo<"reverb"> | null = null;
let hasLoggedMissingToken = false;

export function getEcho() {
  if (typeof window === "undefined") return null;

  const token = store.getState().auth.token;

  if (!token) {
    if (!hasLoggedMissingToken) {
      logRealtimeConnection(
        "Echo client not created because auth token is missing",
      );
      hasLoggedMissingToken = true;
    }

    return null;
  }

  hasLoggedMissingToken = false;

  if (echoInstance) return echoInstance;

  window.Pusher = Pusher;

  const key = process.env.NEXT_PUBLIC_REVERB_APP_KEY;
  const wsHost = process.env.NEXT_PUBLIC_REVERB_HOST;
  const wsPort = Number(process.env.NEXT_PUBLIC_REVERB_PORT);
  const forceTLS = true;
  const authEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`;

  logRealtimeConnection("Creating Echo client", {
    authEndpoint,
    broadcaster: "reverb",
    forceTLS,
    wsHost,
    wsPort,
  });

  echoInstance = new Echo({
    broadcaster: "reverb",
    key,
    wsHost,
    wsPort,
    wssPort: wsPort,
    forceTLS,
    enabledTransports: ["wss", "ws"],
    // disableStats: true,

    authEndpoint,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  echoInstance.connector.pusher.connection.bind("connecting", () => {
    logRealtimeConnection("Socket connecting");
  });

  echoInstance.connector.pusher.connection.bind("connected", () => {
    logRealtimeConnection("Socket connected", {
      socketId: echoInstance?.connector?.pusher?.connection?.socket_id ?? null,
    });
  });

  echoInstance.connector.pusher.connection.bind(
    "state_change",
    (states: { current: string; previous: string }) => {
      logRealtimeConnection("Socket state changed", states);
    },
  );

  echoInstance.connector.pusher.connection.bind("message", (event: unknown) => {
    logRealtimeConnection("Raw socket message received", event);
  });

  echoInstance.connector.pusher.connection.bind("error", (err: unknown) => {
    logRealtimeConnection("Socket connection error", err);
  });

  echoInstance.connector.pusher.connection.bind("disconnected", () => {
    logRealtimeConnection("Socket disconnected");
  });

  echoInstance.connector.pusher.connection.bind("unavailable", () => {
    logRealtimeConnection("Socket unavailable");
  });

  return echoInstance;
}

export function disconnectEcho() {
  if (echoInstance) {
    logRealtimeConnection("Disconnecting Echo client");
    echoInstance.disconnect();
    echoInstance = null;
  }
}

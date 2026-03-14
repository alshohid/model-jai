"use client";

import { useAppSelector } from "@/redux/store";

export function useLiveStatus() {
  const liveStatus = useAppSelector((state) => state.liveStatus.liveStatus);
  const isHydrated = useAppSelector((state) => state.liveStatus.isHydrated);

  return {
    liveStatus,
    isHydrated,
    isLive: liveStatus?.platform_live_status === "live",
    isPaused: liveStatus?.platform_live_status === "pause",
    isStopped: liveStatus?.platform_live_status === "stop",
    platformName: liveStatus?.platform_name ?? null,
    mode: liveStatus?.mode ?? null,
    liveStartedAt: liveStatus?.live_started_at ?? null,
    liveStoppedAt: liveStatus?.live_stopped_at ?? null,
  };
}

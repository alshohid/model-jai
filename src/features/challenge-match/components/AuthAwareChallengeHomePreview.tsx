"use client";

import { useAuth } from "@/redux/features/auth/hooks";
import { cn } from "@/shared/lib/utils/cn";
import ChallengeHomePreview from "./ChallengeHomePreview";

export default function AuthAwareChallengeHomePreview() {
  const { isAuthenticated } = useAuth();

  return (
    <div className={cn(!isAuthenticated && "pt-[112px] sm:pt-[116px]")}>
      <ChallengeHomePreview />
    </div>
  );
}

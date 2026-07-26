"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useConfirmChallengeReadyMutation } from "@/redux/features/challenge/challengeManagement";
import { toast } from "sonner";
import { BatteryCharging, Wifi, Video, ShieldCheck, Check, Loader2 } from "lucide-react";

interface ChallengeReadyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeId: number | string;
}

export default function ChallengeReadyModal({
  open,
  onOpenChange,
  challengeId,
}: ChallengeReadyModalProps) {
  const [confirmReady, { isLoading }] = useConfirmChallengeReadyMutation();

  const [batteryConfirmed, setBatteryConfirmed] = useState(true);
  const [internetConfirmed, setInternetConfirmed] = useState(true);
  const [cameraConfirmed, setCameraConfirmed] = useState(true);
  const [rulesConfirmed, setRulesConfirmed] = useState(true);

  const allConfirmed =
    batteryConfirmed && internetConfirmed && cameraConfirmed && rulesConfirmed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!allConfirmed) {
      toast.error("Please confirm all requirements before proceeding.");
      return;
    }

    try {
      const res = await confirmReady({
        id: challengeId,
        battery_confirmed: batteryConfirmed,
        internet_confirmed: internetConfirmed,
        camera_confirmed: cameraConfirmed,
        rules_confirmed: rulesConfirmed,
      }).unwrap();

      toast.success(res.message || "Ready state confirmed!");
      onOpenChange(false);
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string }; message?: string };
      toast.error(
        errorObj?.data?.message || errorObj?.message || "Failed to confirm ready state.",
      );
    }
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Player Readiness Confirmation"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2 text-white">
        <p className="text-xs text-white/70 leading-relaxed">
          Before starting the match, please verify and confirm that your device and setup meet all competitive requirements.
        </p>

        <div className="flex flex-col gap-3">
          {/* Battery switch */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-500/15 text-green-400">
                <BatteryCharging className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-white">Battery Status</p>
                <p className="text-[11px] text-white/50">Sufficient charge (≥ 20%)</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={batteryConfirmed}
              onClick={() => setBatteryConfirmed(!batteryConfirmed)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                batteryConfirmed ? "bg-[#FF2EC8]" : "bg-white/20"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  batteryConfirmed ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Internet switch */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                <Wifi className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-white">Internet Connection</p>
                <p className="text-[11px] text-white/50">Stable high-speed network</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={internetConfirmed}
              onClick={() => setInternetConfirmed(!internetConfirmed)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                internetConfirmed ? "bg-[#FF2EC8]" : "bg-white/20"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  internetConfirmed ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Camera switch */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400">
                <Video className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-white">Camera & Recording</p>
                <p className="text-[11px] text-white/50">Camera / screen capture enabled</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={cameraConfirmed}
              onClick={() => setCameraConfirmed(!cameraConfirmed)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                cameraConfirmed ? "bg-[#FF2EC8]" : "bg-white/20"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  cameraConfirmed ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          {/* Rules switch */}
          <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-bold text-white">Match Rules Agreed</p>
                <p className="text-[11px] text-white/50">Understood & accept fair play rules</p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={rulesConfirmed}
              onClick={() => setRulesConfirmed(!rulesConfirmed)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                rulesConfirmed ? "bg-[#FF2EC8]" : "bg-white/20"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  rulesConfirmed ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={!allConfirmed || isLoading}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#FF2EC8] to-[#ff43ff] py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(255,46,200,0.4)] transition hover:opacity-90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Confirming...
            </>
          ) : (
            <>
              <Check className="h-4 w-4" />
              I Am Ready
            </>
          )}
        </button>
      </form>
    </AppDialog>
  );
}

"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useSubmitChallengeResultMutation } from "@/redux/features/challenge/challengeManagement";
import { toast } from "sonner";
import { Upload, FileImage, FileVideo, Send, Loader2 } from "lucide-react";

interface ChallengeSubmitResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  challengeId: number | string;
}

export default function ChallengeSubmitResultModal({
  open,
  onOpenChange,
  challengeId,
}: ChallengeSubmitResultModalProps) {
  const [submitResult, { isLoading }] = useSubmitChallengeResultMutation();

  const [notes, setNotes] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!notes.trim() && !imageFile && !videoFile) {
      toast.error("Please provide at least one piece of evidence or notes.");
      return;
    }

    try {
      const res = await submitResult({
        id: challengeId,
        notes: notes.trim(),
        evidence_image: imageFile,
        evidence_video: videoFile,
      }).unwrap();

      toast.success(
        res.message || "Challenge result submitted for admin review.",
      );
      setNotes("");
      setImageFile(null);
      setVideoFile(null);
      onOpenChange(false);
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string }; message?: string };
      toast.error(
        errorObj?.data?.message ||
          errorObj?.message ||
          "Failed to submit match result.",
      );
    }
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Submit Challenge Result"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2 text-white">
        <p className="text-xs text-white/70 leading-relaxed">
          Submit your match score and evidence for admin validation. Evidence will be reviewed by officials.
        </p>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-white/90">
            Match Outcome & Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="e.g. I won the match 21-18. Opponent forfeited in second round."
            className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-white/40 focus:border-[#FF2EC8] focus:outline-none"
          />
        </div>

        {/* Evidence Image */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-white/90 flex items-center gap-1.5">
            <FileImage className="h-4 w-4 text-pink-400" />
            Screenshot / Evidence Image
          </label>
          <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <span className="text-xs text-white/70 truncate pr-2">
              {imageFile ? imageFile.name : "Choose screenshot image file..."}
            </span>
            <Upload className="h-4 w-4 text-white/50 shrink-0" />
          </div>
        </div>

        {/* Evidence Video */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-white/90 flex items-center gap-1.5">
            <FileVideo className="h-4 w-4 text-purple-400" />
            Gameplay Clip / Evidence Video
          </label>
          <div className="relative flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3">
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <span className="text-xs text-white/70 truncate pr-2">
              {videoFile ? videoFile.name : "Choose video clip file..."}
            </span>
            <Upload className="h-4 w-4 text-white/50 shrink-0" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || (!notes.trim() && !imageFile && !videoFile)}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#FF2EC8] to-[#ff43ff] py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(255,46,200,0.4)] transition hover:opacity-90 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting Result...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit For Review
            </>
          )}
        </button>
      </form>
    </AppDialog>
  );
}

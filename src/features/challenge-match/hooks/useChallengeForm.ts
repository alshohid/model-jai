"use client";

import { useState } from "react";
import { useCreateChallengeMutation } from "@/redux/features/challenge/challengeManagement";
import type { ChallengeCreateFormValues, ChallengeCreateScope } from "../types";
import { toast } from "sonner";

const initialFormValues: ChallengeCreateFormValues = {
  gameId: "",
  price: "",
  matchDateTime: "",
  scope: "unique",
  targetPlayerId: "",
  showRealName: true,
  memo: "",
};

interface UseChallengeFormReturn {
  values: ChallengeCreateFormValues;
  isSubmitting: boolean;
  showConfirmModal: boolean;
  logoFile: File | null;
  fileName: string;
  sharedFieldClass: string;
  minDateTime: string;
  updateValue: <K extends keyof ChallengeCreateFormValues>(
    key: K,
    value: ChallengeCreateFormValues[K]
  ) => void;
  updateScope: (scope: ChallengeCreateScope) => void;
  handleFormSubmit: () => boolean;
  handleConfirmSubmit: () => Promise<void>;
  closeConfirmModal: () => void;
}

export default function useChallengeForm(): UseChallengeFormReturn {
  const [values, setValues] = useState<ChallengeCreateFormValues>(initialFormValues);
  const [fileName, setFileName] = useState("No file selected");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [createChallenge, { isLoading: isSubmitting }] = useCreateChallengeMutation();

  // ---- Helpers ----

  const sharedFieldClass =
    "mt-2 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-white outline-none transition focus:border-[#ff43ff]/60";

  // Today's datetime for min attribute
  const today = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const minDateTime = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}T${pad(today.getHours())}:${pad(today.getMinutes())}`;

  const updateValue = <K extends keyof ChallengeCreateFormValues>(
    key: K,
    value: ChallengeCreateFormValues[K]
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const updateScope = (scope: ChallengeCreateScope) => {
    setValues((current) => ({
      ...current,
      scope,
      targetPlayerId: scope === "global" ? "" : current.targetPlayerId,
    }));
  };

  const resetForm = () => {
    setValues(initialFormValues);
    setFileName("No file selected");
    setLogoFile(null);
  };

  // ---- Validation ----

  const validate = (): boolean => {
    if (!values.gameId) {
      toast.error("Please select a game");
      return false;
    }
    if (!values.price || Number(values.price) < 1) {
      toast.error("Please enter a valid price");
      return false;
    }
    if (!values.matchDateTime) {
      toast.error("Please select match date & time");
      return false;
    }
    if (values.scope === "unique" && !values.targetPlayerId) {
      toast.error("Please select a player or user to challenge");
      return false;
    }
    return true;
  };

  // ---- Submit handlers ----

  const handleFormSubmit = (): boolean => {
    if (!validate()) return false;
    setShowConfirmModal(true);
    return true;
  };

  const handleConfirmSubmit = async () => {
    try {
      const [dateOnly, timeOnly] = values.matchDateTime.split("T");

      const result = await createChallenge({
        game_id: Number(values.gameId),
        amount: Number(values.price),
        match_date: dateOnly,
        match_time: timeOnly,
        mode: values.scope,
        target_player_id:
          values.scope === "unique" ? Number(values.targetPlayerId) : null,
        show_real_name: values.showRealName,
        memo: values.memo,
        logo: logoFile,
      }).unwrap();

      if (result.success) {
        toast.success(result.message || "Challenge created successfully!");
        resetForm();
        setShowConfirmModal(false);
      }
    } catch (error: unknown) {
      const err = error as {
        data?: { message?: string };
        message?: string;
      };
      const errorMessage =
        err?.data?.message ||
        err?.message ||
        "Failed to create challenge. Please try again.";
      toast.error(errorMessage);
      setShowConfirmModal(false);
    }
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  return {
    values,
    isSubmitting,
    showConfirmModal,
    logoFile,
    fileName,
    sharedFieldClass,
    minDateTime,
    updateValue,
    updateScope,
    handleFormSubmit,
    handleConfirmSubmit,
    closeConfirmModal,
  };
}

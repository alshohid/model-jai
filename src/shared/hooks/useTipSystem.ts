

import { useState, useCallback, useEffect } from "react";
import type { SupportSide } from "@/shared/components/watchLive/types";

type TipView = "menu" | "custom";

interface FlyingCoin {
  id: string;
  side: SupportSide;
  txJitter?: number;
  ty?: number;
  rot?: number;
  dur?: number;
}

interface UseTipSystemReturn {
  tipOpen: SupportSide | null;
  tipView: TipView;
  flyingCoins: FlyingCoin[];
  openTip: (side: SupportSide) => void;
  closeTip: () => void;
  switchToCustomView: () => void;
  switchToMenuView: () => void;
  triggerFlyingCoin: (side: SupportSide) => void;
  removeFlyingCoin: (id: string) => void;
}

export function useTipSystem(): UseTipSystemReturn {
  const [tipOpen, setTipOpen] = useState<SupportSide | null>(null);
  const [tipView, setTipView] = useState<TipView>("menu");
  const [flyingCoins, setFlyingCoins] = useState<FlyingCoin[]>([]);

  const openTip = useCallback((side: SupportSide) => {
    setTipView("menu");
    setTipOpen((prev) => (prev === side ? null : side));
  }, []);

  const closeTip = useCallback(() => {
    setTipOpen(null);
    setTipView("menu");
  }, []);

  const switchToCustomView = useCallback(() => {
    setTipView("custom");
  }, []);

  const switchToMenuView = useCallback(() => {
    setTipView("menu");
  }, []);

  const triggerFlyingCoin = useCallback((side: SupportSide) => {
    const txJitter = Math.round((Math.random() * 16 - 8) * 10) / 10;
    const ty = -(300 + Math.round(Math.random() * 200));
    const rot = Math.round(Math.random() * 40 - 20);
    const dur = 700 + Math.round(Math.random() * 600);

    setFlyingCoins((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        side,
        txJitter,
        ty,
        rot,
        dur,
      },
    ]);
  }, []);

  const removeFlyingCoin = useCallback((id: string) => {
    setFlyingCoins((prev) => prev.filter((coin) => coin.id !== id));
  }, []);

  // Close tip when clicking anywhere outside the active caret/popover.
  useEffect(() => {
    function handleDocPointerDown(e: PointerEvent) {
      if (!tipOpen) return;
      const target = e.target as Element | null;
      if (!target) return;
      if (target.closest("[data-tip-popover]")) return;
      if (target.closest(`[data-tip-caret="${tipOpen}"]`)) return;
      closeTip();
    }

    document.addEventListener("pointerdown", handleDocPointerDown, true);
    return () =>
      document.removeEventListener("pointerdown", handleDocPointerDown, true);
  }, [closeTip, tipOpen]);

  return {
    tipOpen,
    tipView,
    flyingCoins,
    openTip,
    closeTip,
    switchToCustomView,
    switchToMenuView,
    triggerFlyingCoin,
    removeFlyingCoin,
  };
}

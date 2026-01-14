export type WatchLiveSlide = {
    id: string;
    bg: string;
    game: string;
    title: string;
    meta: string;
    isLive?: boolean;
    avatars?: string[];
    thumbs: string[];
};
export type PanelBadge = "taken" | "available" | "winner";

export type PanelSide = {
    id: string;
    name: string;
    points: number;
    badge: PanelBadge;

    /** If you want each slot to be a separate Mux feed later */
    playbackId?: string;

    /** fallback background image */
    imageSrc?: string;
};

export type TriplePanelState = {
    left: PanelSide;
    middle: {
        label: string;
        imageSrc?: string;
        playbackId?: string;
    };
    right: PanelSide;
};

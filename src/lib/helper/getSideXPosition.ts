import { SupportSide } from "@/shared/components/watchLive/types";

export const getSideXPosition = (side: SupportSide): number => {
    switch (side) {
        case "left":
            return 16.6;
        case "middle":
            return 50;
        case "right":
            return 83.4;
        default:
            return 50;
    }
};

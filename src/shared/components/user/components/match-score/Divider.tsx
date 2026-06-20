import { memo } from "react";

export const Divider = memo(function Divider() {
    return (
        <div className="flex h-14 items-center">
            <div className="h-full w-px bg-white/15" />
        </div>
    );
});
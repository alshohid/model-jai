"use client";

import { ArrowUpRight, ShoppingBag } from "lucide-react";
import AppDropdownMenu, {
    type AppDropdownItem,
} from "@/shared/components/dropdown/AppDropdownMenu";
import PointsButton from "@/shared/UI/button/PointsButton";

type Props = {
    points: number;
    className?: string;
    size?: "default" | "compact";
    icon?: string;
};

const menuItems: AppDropdownItem[] = [
    {
        label: "Buy Points",
        href: "/point-store",
        icon: <ShoppingBag className="h-4 w-4" />,
    },
    {
        label: "Withdraw",
        href: "/user-profile#my-profile-section",
        icon: <ArrowUpRight className="h-4 w-4" />,
    },
];

export default function PointsMenuButton({
    points,
    className,
    size = "default",
    icon = "/images/home/point_icon.png",
}: Props) {
    return (
        <AppDropdownMenu
            align="end"
            sideOffset={10}
            items={menuItems}
            contentClassName="min-w-[180px]"
            trigger={
                <PointsButton
                    points={points}
                    icon={icon}
                    size={size}
                    className={className}
                    aria-label="Open points menu"
                />
            }
        />
    );
}

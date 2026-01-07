import { cn } from "@/shared/lib/utils/cn";

type LiveSectionHeaderProps = {
    title: string;
    className?: string;
};

export default function LiveSectionHeader({
    title,
    className,
}: LiveSectionHeaderProps) {
    return (
        <h2
            className={cn(
                "text-white text-3xl font-semibold text-center",
                className
            )}
        >
            {title}
        </h2>
    );
}

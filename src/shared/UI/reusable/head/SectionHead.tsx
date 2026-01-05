import { cn } from "@/shared/lib/utils/cn";

type Props = {
    title: string;
    className?: string;
};

export default function SectionHead({ title, className }: Props) {
    return (
        <div className={cn("w-full", className)}>
            <h2 className="text-white text-3xl sm:text-4xl font-medium">{title}</h2>
            <div className="mt-6 h-px w-full bg-white/15" />
        </div>
    );
}

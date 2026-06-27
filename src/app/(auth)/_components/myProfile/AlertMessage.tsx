import { AlertTriangle } from "lucide-react";

interface AlertMessageProps {
    message: string;
    className?: string;
}

export default function AlertMessage({ message, className = "" }: AlertMessageProps) {
    return (
        <div className={`flex items-center gap-3 w-full rounded-xl border border-[#7A5323] bg-transparent px-4 py-2 shadow-lg shadow-black/20 backdrop-blur-sm ${className}`}>
            <AlertTriangle className="h-4 w-4 shrink-0 text-[#d2bc90]" strokeWidth={2.3} />
            <p className="text-xs font-medium text-[#FFD88C] leading-6">
                {message}
            </p>
        </div>
    );
}
export const Meta = ({ icon, text }: { icon: string; text: string }) => (
    <div className="flex items-center gap-2">
        <span className="text-cyan-300 text-[10px] md:text-[14px]">{icon}</span>
        <span className="text-[9px] md:text-[14px]">{text}</span>
    </div>
);
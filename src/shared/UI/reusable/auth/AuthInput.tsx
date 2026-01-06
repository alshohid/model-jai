import { AuthInputProps } from "@/types/authType/AuthTypes";



export function AuthInput({ label, type = "text", icon, register, name }: AuthInputProps) {
    return (
        <div className="relative">
            <div
                className="
            flex items-center gap-3
            w-full
            rounded-[8px]
            border border-white/10
            bg-white/10
            px-4 py-3
            backdrop-blur-[6px]
            "
            >
                <div className="opacity-70">{icon}</div>
                <input
                    type={type}
                    placeholder={label}
                    className="
            w-full bg-transparent outline-none
            text-white/90 placeholder:text-white/35
            text-[14px]
            "
                    {...register(name, { required: true })}
                />
            </div>
        </div>
    );
}
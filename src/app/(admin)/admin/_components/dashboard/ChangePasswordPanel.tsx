/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useChangeAdminPasswordMutation } from "@/redux/features/user/userManagement"; // adjust path
import { toast } from "sonner";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";

function PasswordField({
    label,
    value,
    onChange,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
}) {
    const [show, setShow] = useState(false);
    return (
        <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/40">
                {label}
            </label>
            <div className="relative flex items-center">
                <Lock className="absolute left-3.5 text-white/25 size-3.5 pointer-events-none" />
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder ?? "••••••••"}
                    className="w-full h-11 pl-9 pr-10 rounded-lg bg-white/5 border border-white/10
                        text-white text-sm placeholder:text-white/20
                        focus:outline-none focus:border-[#FF2EC8]/50 focus:bg-[#FF2EC8]/5
                        transition-all duration-200"
                />
                <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShow((p) => !p)}
                    className="absolute right-3 text-white/30 hover:text-white/60 transition-colors cursor-pointer"
                >
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
            </div>
        </div>
    );
}

export default function ChangePasswordPanel() {
    const [form, setForm] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const [changePassword, { isLoading }] = useChangeAdminPasswordMutation();

    const set = (key: keyof typeof form) => (v: string) =>
        setForm((p) => ({ ...p, [key]: v }));

    const handleSubmit = async () => {
        if (!form.current_password || !form.password || !form.password_confirmation) {
            toast.error("All fields are required.");
            return;
        }
        if (form.password !== form.password_confirmation) {
            toast.error("New passwords do not match.");
            return;
        }
        if (form.password.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }
        try {
            await changePassword(form).unwrap();
            toast.success("Password changed successfully.");
            setForm({ current_password: "", password: "", password_confirmation: "" });
        } catch (err: any) {
            toast.error(err?.data?.message ?? "Failed to change password.");
        }
    };

    return (
        <div className="flex flex-col h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#FF2EC8]/10 border border-[#FF2EC8]/20 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="size-4 text-[#FF2EC8]" />
                </div>
                <div>
                    <h3 className="text-[15px] font-semibold text-white leading-none mb-0.5">
                        Change Password
                    </h3>
                    <p className="text-[11px] text-white/35">Update your admin login password</p>
                </div>
            </div>

            <div className="border-t border-white/8" />

            {/* Fields */}
            <div className="space-y-4 flex-1">
                <PasswordField
                    label="Current Password"
                    value={form.current_password}
                    onChange={set("current_password")}
                    placeholder="Enter current password"
                />
                <PasswordField
                    label="New Password"
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Min. 8 characters"
                />
                <PasswordField
                    label="Confirm New Password"
                    value={form.password_confirmation}
                    onChange={set("password_confirmation")}
                    placeholder="Re-enter new password"
                />

                {/* Strength hint */}
                {form.password.length > 0 && (
                    <div className="space-y-1.5">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map((level) => {
                                const strength =
                                    form.password.length >= 12 &&
                                        /[A-Z]/.test(form.password) &&
                                        /[0-9]/.test(form.password) &&
                                        /[^A-Za-z0-9]/.test(form.password)
                                        ? 4
                                        : form.password.length >= 10
                                            ? 3
                                            : form.password.length >= 8
                                                ? 2
                                                : 1;
                                return (
                                    <div
                                        key={level}
                                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${level <= strength
                                                ? strength === 4
                                                    ? "bg-green-400"
                                                    : strength === 3
                                                        ? "bg-yellow-400"
                                                        : strength === 2
                                                            ? "bg-orange-400"
                                                            : "bg-red-400"
                                                : "bg-white/10"
                                            }`}
                                    />
                                );
                            })}
                        </div>
                        <p className="text-[10px] text-white/30">
                            {form.password.length < 8
                                ? "Too short"
                                : form.password.length < 10
                                    ? "Weak — add numbers or symbols"
                                    : form.password.length < 12
                                        ? "Moderate"
                                        : "Strong password"}
                        </p>
                    </div>
                )}
            </div>

            <div className="border-t border-white/8" />

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full h-11 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200
                    ${isLoading
                        ? "bg-white/10 text-white/30 cursor-not-allowed"
                        : "bg-[#FF2EC8] hover:bg-[#ff48d0] text-white active:scale-[0.98] shadow-[0_0_20px_rgba(255,46,200,0.25)] hover:shadow-[0_0_28px_rgba(255,46,200,0.4)] cursor-pointer"
                    }`}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
                        Updating...
                    </span>
                ) : (
                    "Update Password"
                )}
            </button>
        </div>
    );
}
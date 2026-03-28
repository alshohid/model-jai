/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState } from "react";
import { useAdminChangeSettingsMutation } from "@/redux/features/user/userManagement"; // adjust path
import { toast } from "sonner";
import { Settings, User, Mail, Phone, Globe, Camera, Loader2 } from "lucide-react";
import Image from "next/image";

function SettingsField({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    icon,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    type?: string;
    icon: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-[11px] font-semibold uppercase tracking-widest text-white/40">
                {label}
            </label>
            <div className="relative flex items-center">
                <span className="absolute left-3.5 text-white/25 pointer-events-none [&>svg]:size-3.5">
                    {icon}
                </span>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full h-11 pl-9 pr-4 rounded-lg bg-white/5 border border-white/10
                        text-white text-sm placeholder:text-white/20
                        focus:outline-none focus:border-[#24C3FF]/50 focus:bg-[#24C3FF]/5
                        transition-all duration-200"
                />
            </div>
        </div>
    );
}

interface AdminSettingsPanelProps {
    initialData?: {
        name?: string;
        email?: string;
        image?: string | null;
        phone?: string | null;
        nationality?: string | null;
    };
}

export default function AdminSettingsPanel({ initialData }: AdminSettingsPanelProps) {
    const [form, setForm] = useState({
        name: initialData?.name ?? "",
        email: initialData?.email ?? "",
        phone: initialData?.phone ?? "",
        nationality: initialData?.nationality ?? "",
    });

    // Keep the actual File object separately — never put blob URL in payload
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image ?? null);
    const fileRef = useRef<HTMLInputElement>(null);

    const [adminChangeSettings, { isLoading }] = useAdminChangeSettingsMutation();

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name ?? "",
                email: initialData.email ?? "",
                phone: initialData.phone ?? "",
                nationality: initialData.nationality ?? "",
            });
            setPreviewUrl(initialData.image ?? null);
        }
    }, [initialData]);

    const set = (key: keyof typeof form) => (v: string) =>
        setForm((p) => ({ ...p, [key]: v }));

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Store the File object for FormData submission
        setImageFile(file);

        // Local preview only — this URL never goes to the server
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Cleanup previous blob URL
        return () => URL.revokeObjectURL(objectUrl);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.email) {
            toast.error("Name and email are required.");
            return;
        }

        // Build FormData — backend receives multipart/form-data
        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("phone", form.phone);
        formData.append("nationality", form.nationality);

        // Only append image if a new file was selected
        if (imageFile) {
            formData.append("image", imageFile);
        }

        try {
            await adminChangeSettings(formData as any).unwrap();
            toast.success("Settings updated successfully.");
            setImageFile(null); // clear after save
        } catch (err: any) {
            toast.error(err?.data?.message ?? "Failed to update settings.");
        }
    };

    return (
        <div className="flex flex-col h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#24C3FF]/10 border border-[#24C3FF]/20 flex items-center justify-center flex-shrink-0">
                    <Settings className="size-4 text-[#24C3FF]" />
                </div>
                <div>
                    <h3 className="text-[15px] font-semibold text-white leading-none mb-0.5">
                        Admin Settings
                    </h3>
                    <p className="text-[11px] text-white/35">Update your profile and account details</p>
                </div>
            </div>

            <div className="border-t border-white/8" />

            {/* Avatar upload */}
            <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white/10 bg-white/5">
                        {previewUrl ? (
                            <Image
                                src={previewUrl}
                                alt="avatar"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                                unoptimized
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <User className="size-6 text-white/20" />
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full
                            bg-[#24C3FF] flex items-center justify-center
                            shadow-[0_0_8px_rgba(36,195,255,0.4)] cursor-pointer
                            hover:bg-[#3fd0ff] transition-colors"
                    >
                        <Camera className="size-3 text-white" />
                    </button>
                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>
                <div>
                    <p className="text-[13px] font-medium text-white">
                        Profile Photo
                        {imageFile && (
                            <span className="ml-2 text-[11px] text-[#24C3FF]/70 font-normal">
                                — {imageFile.name}
                            </span>
                        )}
                    </p>
                    <p className="text-[11px] text-white/35 mt-0.5">
                        Click the camera icon to upload
                    </p>
                </div>
            </div>

            {/* Fields */}
            <div className="space-y-4 flex-1">
                <SettingsField
                    label="Full Name"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Admin name"
                    icon={<User />}
                />
                <SettingsField
                    label="Email Address"
                    value={form.email}
                    onChange={set("email")}
                    placeholder="admin@example.com"
                    type="email"
                    icon={<Mail />}
                />
                <div className="grid grid-cols-2 gap-3">
                    <SettingsField
                        label="Phone"
                        value={form.phone}
                        onChange={set("phone")}
                        placeholder="+1 000 000 0000"
                        type="tel"
                        icon={<Phone />}
                    />
                    <SettingsField
                        label="Nationality"
                        value={form.nationality}
                        onChange={set("nationality")}
                        placeholder="e.g. Bangladeshi"
                        icon={<Globe />}
                    />
                </div>
            </div>

            <div className="border-t border-white/8" />

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full h-11 rounded-xl font-semibold text-sm tracking-wide transition-all duration-200
                    ${isLoading
                        ? "bg-white/10 text-white/30 cursor-not-allowed"
                        : "bg-[#24C3FF] hover:bg-[#3fd0ff] text-white active:scale-[0.98] shadow-[0_0_20px_rgba(36,195,255,0.25)] hover:shadow-[0_0_28px_rgba(36,195,255,0.4)] cursor-pointer"
                    }`}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="size-3.5 animate-spin" />
                        Saving...
                    </span>
                ) : (
                    "Save Changes"
                )}
            </button>
        </div>
    );
}
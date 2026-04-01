/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { cn } from "@/shared/lib/utils/cn";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
import { MailIcon } from "@/shared/UI/icon/icon";
import AppDialog from "@/shared/components/modal/AppDialog";

type EditProfileFormValues = {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
    contact: string;
    nationality: string;
    image?: File | null;
};

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    defaultValues?: Partial<EditProfileFormValues>;
    avatarSrc: string;
    onSave?: (data: EditProfileFormValues) => void;
    isLoading?: boolean;
};

export default function EditProfileDialog({
    open,
    onOpenChange,
    defaultValues,
    avatarSrc,
    onSave,
    isLoading,
}: Props) {
    const fileRef = React.useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = React.useState<string>(avatarSrc);
    const [file, setFile] = React.useState<File | null>(null);

    const { register, handleSubmit, reset } = useForm<EditProfileFormValues>({
        defaultValues: {
            first_name: defaultValues?.first_name ?? "",
            middle_name: defaultValues?.middle_name ?? "",
            last_name: defaultValues?.last_name ?? "",
            email: defaultValues?.email ?? "",
            contact: defaultValues?.contact ?? "",
            nationality: defaultValues?.nationality ?? "",
        },
    });

    React.useEffect(() => {
        setPreview(avatarSrc);
        reset({
            first_name: defaultValues?.first_name ?? "",
            middle_name: defaultValues?.middle_name ?? "",
            last_name: defaultValues?.last_name ?? "",
            email: defaultValues?.email ?? "",
            contact: defaultValues?.contact ?? "",
            nationality: defaultValues?.nationality ?? "",
        });
    }, [avatarSrc, defaultValues, reset, open]);

    const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        if (!f) return;

        setFile(f);
        const url = URL.createObjectURL(f);
        setPreview(url);
    };

    const submit = (data: EditProfileFormValues) => {

        onSave?.({
            ...data,
            image: file,
        });
    };

    return (
        <AppDialog open={open} onOpenChange={onOpenChange} title="Edit Profile">
            <div className={cn("rounded-[16px] border border-white/10 bg-white/5 p-4")}>
                <div className="relative overflow-hidden rounded-[16px] bg-white/5 border border-white/10">
                    <div className="relative w-full h-[clamp(180px,32vh,320px)]">
                        <Image
                            src={preview}
                            alt="Profile preview"
                            fill
                            priority
                            sizes="(max-width: 520px) 92vw, 520px"
                            className="object-cover rounded-lg"
                            unoptimized
                        />
                    </div>

                    {/* upload button overlay */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 w-full flex justify-center">
                        <button
                            type="button"
                            onClick={() => fileRef.current?.click()}
                            className={cn(
                                "cursor-pointer",
                                "h-[34px] px-5 rounded-[8px]",
                                "bg-[#FF2EC8] text-white text-[13px] font-medium",
                                "border border-white/35",
                                "shadow-[0_6px_20px_rgba(255,46,200,0.25)]",
                                "hover:opacity-95 transition"
                            )}
                        >
                            Upload Profile Picture
                        </button>
                    </div>

                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={onPick}
                    />
                </div>
            </div>

            {/* ✅ Form card */}
            <form
                onSubmit={handleSubmit(submit)}
                className={cn("mt-4 rounded-[16px] border border-white/10 bg-white/5 p-4")}
            >
                <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-2">
                    <Field label="First Name">
                        <AuthInput
                            label="First Name"
                            name="first_name"
                            type="text"
                            register={register as any}
                            icon={<span className="text-white/60">👤</span>}
                        />
                    </Field>

                    <Field label="Middle Name">
                        <AuthInput
                            label="Middle Name"
                            name="middle_name"
                            type="text"
                            register={register as any}
                            icon={<span className="text-white/60">👤</span>}
                        />
                    </Field>
                </div>

                <Field label="Last Name">
                    <AuthInput
                        label="Last Name"
                        name="last_name"
                        type="text"
                        register={register as any}
                        icon={<span className="text-white/60">👤</span>}
                    />
                </Field>

                <Field label="Email">
                    <AuthInput
                        label="Email"
                        name="email"
                        type="email"
                        readOnly={true}
                        register={register as any}
                        icon={<MailIcon />}
                    />
                </Field>

                <Field label="Contact (optional)">
                    <AuthInput
                        label="Contact"
                        name="contact"
                        type="text"
                        register={register as any}
                        icon={<span className="text-white/60">📞</span>}
                    />
                </Field>

                <Field label="Nationality">
                    <AuthInput
                        label="Nationality"
                        name="nationality"
                        type="text"
                        register={register as any}
                        icon={<span className="text-white/60">🌍</span>}
                    />
                </Field>

                <StartStreamingButton disabled={isLoading} className={cn("w-full mt-4 bg-[#FF2EC8] hover:opacity-95")}>
                    {isLoading ? "Saving..." : "Save"}
                </StartStreamingButton>
            </form>
        </AppDialog>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className=" first:mt-0">
            <p className="mb-2 text-white/60 text-[12px]">{label}</p>
            {children}
        </div>
    );
}

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils/cn";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import AppDialog from "@/shared/components/modal/AppDialog";
import { getErrorMessage } from "@/lib/utils";

type EditBioFormValues = {
    bio: string;
};

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    defaultBio?: string | null;
    onSave?: (bio: string) => Promise<void> | void;
    isLoading?: boolean;
};

export default function EditBioDialog({
    open,
    onOpenChange,
    defaultBio,
    onSave,
    isLoading,
}: Props) {
    const { register, handleSubmit, reset } = useForm<EditBioFormValues>({
        defaultValues: {
            bio: defaultBio ?? "",
        },
    });

    React.useEffect(() => {
        if (open) {
            reset({
                bio: defaultBio ?? "",
            });
        }
    }, [defaultBio, reset, open]);

    const submit = async (data: EditBioFormValues) => {
        try {
            await onSave?.(data.bio);
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Bio update failed"));
        }
    };

    return (
        <AppDialog open={open} onOpenChange={onOpenChange} title="Edit Bio">
            <form
                onSubmit={handleSubmit(submit)}
                className={cn("mt-4 rounded-[16px] border border-white/10 bg-white/5 p-4 space-y-4")}
            >
                <div>
                    <p className="mb-2 text-white/60 text-[12px]">Write a brief bio about yourself</p>
                    <textarea
                        {...register("bio")}
                        className={cn(
                            "w-full h-32 rounded-[12px] bg-[#1a121a]/80 border border-white/10 p-3",
                            "text-white text-[14px] placeholder-white/30 focus:outline-none focus:border-[#FF2EC8]/50 transition resize-none"
                        )}
                        placeholder="Tell the world who you are..."
                        maxLength={500}
                    />
                </div>

                <StartStreamingButton disabled={isLoading} className={cn("w-full bg-[#FF2EC8] hover:opacity-95")}>
                    {isLoading ? "Saving..." : "Save Bio"}
                </StartStreamingButton>
            </form>
        </AppDialog>
    );
}

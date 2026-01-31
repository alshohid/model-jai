"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import AppDialog from "@/shared/components/modal/AppDialog";
import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import { MailIcon } from "@/shared/UI/icon/icon";
import { cn } from "@/shared/lib/utils/cn";
import { PhilippinePeso } from "lucide-react";

type FormValues = {
    senderName: string;
    email: string;
    amount: string; // keep string for input
};

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    defaultValues?: Partial<FormValues>;
    onSend?: (data: { senderName: string; email: string; amount: number }) => void;
};

export default function SendMoneyDialog({
    open,
    onOpenChange,
    defaultValues,
    onSend,
}: Props) {
    const { register, handleSubmit, reset } = useForm<FormValues>({
        defaultValues: {
            senderName: defaultValues?.senderName ?? "",
            email: defaultValues?.email ?? "",
            amount: defaultValues?.amount ?? "",
        },
    });

    // ✅ dialog open হলে values sync করো
    React.useEffect(() => {
        if (!open) return;
        reset({
            senderName: defaultValues?.senderName ?? "",
            email: defaultValues?.email ?? "",
            amount: defaultValues?.amount ?? "",
        });
    }, [open, defaultValues, reset]);

    const submit = (data: FormValues) => {
        const amountNum = Number(data.amount);

        // basic guard (frontend dummy)
        if (!data.senderName?.trim()) return;
        if (!data.email?.trim()) return;
        if (!Number.isFinite(amountNum) || amountNum <= 0) return;

        onSend?.({
            senderName: data.senderName.trim(),
            email: data.email.trim(),
            amount: amountNum,
        });

        onOpenChange(false);
    };

    return (
        <AppDialog open={open} onOpenChange={onOpenChange} title="Send Point">
            <div
                className={cn(
                    "rounded-[16px] border border-white/12 bg-white/5",
                    "p-4 sm:p-5"
                )}
            >
                <form onSubmit={handleSubmit(submit)}>
                    <Field label="Sender Full Name">
                        <AuthInput
                            label="Michael Rohan"
                            name="senderName"
                            type="text"
                            register={register as any}
                            icon={<span className="text-white/60">👤</span>}
                        />
                    </Field>

                    <Field label="Email">
                        <AuthInput
                            label="michael@gmail.com"
                            name="email"
                            type="email"
                            register={register as any}
                            icon={<MailIcon />}
                        />
                    </Field>

                    <Field label="Amount">
                        <AuthInput
                            label="100"
                            name="amount"
                            type="number"
                            register={register as any}
                            icon={<span className="text-white/60"><PhilippinePeso size={20} /></span>}
                        />
                    </Field>

                    <StartStreamingButton
                        className={cn(
                            "w-full mt-4",
                            "bg-[#FF2EC8] hover:opacity-95"
                        )}
                    >
                        Send
                    </StartStreamingButton>
                </form>
            </div>
        </AppDialog>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="mt-3 first:mt-0">
            <p className="mb-2 text-white/60 text-[12px]">{label}</p>
            {children}
        </div>
    );
}

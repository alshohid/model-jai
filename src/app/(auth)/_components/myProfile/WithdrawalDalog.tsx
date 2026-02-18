/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import AppDialog from "@/shared/components/modal/AppDialog";
import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import { MailIcon } from "@/shared/UI/icon/icon";
import { cn } from "@/shared/lib/utils/cn";

type FormValues = {
    email: string;
    amount: string;
};

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    withdrawableBalance: number;
    defaultValues?: Partial<FormValues>;
    onSend?: (data: { senderName: string; email: string; amount: number }) => void;
};

export default function WithdrawalDialog({
    open,
    onOpenChange,
    withdrawableBalance,
    defaultValues,
    onSend,
}: Props) {
    const { register, handleSubmit, reset, watch } = useForm<FormValues>({
        defaultValues: {
            email: "",
            amount: "",
        },
    });

    React.useEffect(() => {
        if (!open) return;
        reset({
            email: defaultValues?.email ?? "",
            amount: "",
        });
    }, [open, defaultValues, reset]);

    const amountValue = Number(watch("amount"));

    const submit = (data: FormValues) => {
        const amountNum = Number(data.amount);
        if (!data.email?.trim()) return;
        if (!Number.isFinite(amountNum) || amountNum <= 0) return;
        if (amountNum > withdrawableBalance) return;

        onSend?.({
            senderName: data.email.trim(),
            email: data.email.trim(),
            amount: amountNum,
        });

        onOpenChange(false);
    };

    return (
        <AppDialog open={open} onOpenChange={onOpenChange} title="Withdraw Money">
            <div className="rounded-[16px] border border-white/12 bg-white/5 p-4 sm:p-5">

                {/* ✅ Balance Display */}
                <div className="mb-4 rounded-xl bg-black/30 p-3 text-center">
                    <p className="text-white/60 text-xs">Available Balance</p>
                    <p className="text-white text-xl font-semibold">
                        ${withdrawableBalance.toFixed(2)}
                    </p>
                </div>

                <form onSubmit={handleSubmit(submit)}>

                    <Field label="Email">
                        <AuthInput
                            label="michael@gmail.com"
                            name="email"
                            type="email"
                            register={register as any}
                            icon={<MailIcon />}
                        />
                    </Field>

                    <Field label="Withdrawal Amount">
                        <AuthInput
                            label={`Max ${withdrawableBalance}`}
                            name="amount"
                            type="number"
                            register={register as any}
                            icon={<span className="text-white/60">💸</span>}
                        />

                        {amountValue > withdrawableBalance && (
                            <p className="mt-1 text-xs text-red-400">
                                Amount exceeds available balance
                            </p>
                        )}
                    </Field>

                    <StartStreamingButton
                        disabled={
                            !amountValue ||
                            amountValue <= 0 ||
                            amountValue > withdrawableBalance
                        }
                        className={cn(
                            "w-full mt-4",
                            "bg-[#FF2EC8] hover:opacity-95 disabled:opacity-50"
                        )}
                    >
                        Withdraw
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

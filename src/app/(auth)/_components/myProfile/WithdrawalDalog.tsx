/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import AppDialog from "@/shared/components/modal/AppDialog";
import { AuthInput } from "@/shared/UI/reusable/auth/AuthInput";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import PaymentMethodLogo from "@/shared/components/payment/PaymentMethodLogo";
import { cn } from "@/shared/lib/utils/cn";
import { PaymentMethodConfig } from "@/shared/constants/paymentMethods";
import { PaymentMethodId } from "@/types/user/point";

type FormValues = {
    amount: string;
};

type ConnectedPaymentMethod = {
    method: PaymentMethodConfig;
    identifier: string | null;
};

type Props = {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    withdrawableBalance: number;
    defaultValues?: Partial<FormValues>;
    connectedPaymentMethods: ConnectedPaymentMethod[];
    selectedPaymentMethod?: PaymentMethodId | null;
    onSelectedPaymentMethodChange?: (paymentMethod: PaymentMethodId) => void;
    onSend?: (data: { amount: number; paymentMethod: PaymentMethodId }) => void;
    isLoading?: boolean;
};

export default function WithdrawalDialog({
    open,
    onOpenChange,
    withdrawableBalance,
    defaultValues,
    connectedPaymentMethods,
    selectedPaymentMethod,
    onSelectedPaymentMethodChange,
    onSend,
    isLoading,
}: Props) {
    const { register, handleSubmit, reset, control } = useForm<FormValues>({
        defaultValues: {
            amount: "",
        },
    });

    React.useEffect(() => {
        if (!open) return;
        reset({
            amount: "",
        });
    }, [open, defaultValues, reset]);

    const amountValue = Number(
        useWatch({
            name: "amount",
            defaultValue: "",
            control,
        })
    );
    const activeMethod =
        connectedPaymentMethods.find(
            (item) => item.method.id === selectedPaymentMethod
        ) ?? connectedPaymentMethods[0] ?? null;

    const submit = (data: FormValues) => {
        const amountNum = Number(data.amount);
        if (!activeMethod) return;
        if (!Number.isFinite(amountNum) || amountNum <= 0) return;
        if (amountNum > withdrawableBalance) return;

        onSend?.({
            amount: amountNum,
            paymentMethod: activeMethod.method.id,
        });

        onOpenChange(false);
    };

    return (
        <AppDialog open={open} onOpenChange={onOpenChange} title="Withdraw Money">
            <div className="rounded-[16px] border border-white/12 bg-white/5 p-4 sm:p-5">
                <div className="mb-4 rounded-xl bg-black/30 p-3 text-center">
                    <p className="text-white/60 text-xs">Available Balance</p>
                    <p className="text-white text-xl font-semibold">
                        ${withdrawableBalance.toFixed(2)}
                    </p>
                </div>

                {connectedPaymentMethods.length > 0 ? (
                    <div className="mb-4">
                        <Field label="Choose Payout Method">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {connectedPaymentMethods.map((item) => {
                                    const isActive =
                                        item.method.id === activeMethod?.method.id;

                                    return (
                                        <button
                                            key={item.method.id}
                                            type="button"
                                            onClick={() =>
                                                onSelectedPaymentMethodChange?.(
                                                    item.method.id
                                                )
                                            }
                                            className={cn(
                                                "flex items-center gap-3 rounded-[16px] border px-3 py-3 text-left transition",
                                                isActive
                                                    ? "border-[#00C3FF]/40 bg-[#00C3FF]/12"
                                                    : "border-white/10 bg-black/20 hover:border-white/20"
                                            )}
                                        >
                                            <PaymentMethodLogo
                                                method={item.method}
                                                className="size-11 rounded-[14px]"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-semibold text-white">
                                                    {item.method.name}
                                                </p>
                                                <p className="mt-1 truncate text-xs text-white/55">
                                                    {item.identifier || `${item.method.name} connected`}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </Field>

                        {activeMethod ? (
                            <div className="mt-3 rounded-[16px] border border-white/10 bg-black/20 px-3 py-3">
                                <p className="text-[11px] uppercase tracking-[0.22em] text-white/35">
                                    Payout Destination
                                </p>
                                <p className="mt-1 text-sm font-medium text-white">
                                    {activeMethod.identifier || `${activeMethod.method.name} account connected`}
                                </p>
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <div className="mb-4 rounded-[16px] border border-dashed border-white/15 bg-black/20 px-4 py-4 text-sm leading-6 text-white/55">
                        Connect at least one payment method before sending a withdrawal request.
                    </div>
                )}

                <form onSubmit={handleSubmit(submit)}>
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
                            !activeMethod ||
                            !amountValue || isLoading ||
                            amountValue <= 0 ||
                            amountValue > withdrawableBalance
                        }
                        className={cn(
                            "w-full mt-4",
                            "bg-[#FF2EC8] hover:opacity-95 disabled:opacity-50"
                        )}
                    >
                        {isLoading ? "Processing..." : "Send Withdraw Request"}
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

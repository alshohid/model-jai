"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import AppDialog from "@/shared/components/modal/AppDialog";
import StartStreamingButton from "@/shared/UI/button/StartStreamingButton";
import PaymentMethodLogo from "@/shared/components/payment/PaymentMethodLogo";
import { PaymentMethodConfig } from "@/shared/constants/paymentMethods";
import { cn } from "@/shared/lib/utils/cn";

type FormValues = {
    identifier: string;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    method: PaymentMethodConfig | null;
    isLoading?: boolean;
    onSubmit: (method: PaymentMethodConfig, value: string) => Promise<void> | void;
};

export default function ConnectPaymentMethodDialog({
    open,
    onOpenChange,
    method,
    isLoading = false,
    onSubmit,
}: Props) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            identifier: "",
        },
    });

    useEffect(() => {
        if (!open) return;
        reset({ identifier: "" });
    }, [open, method, reset]);

    if (!method || !method.connectField) return null;

    const submit = async (values: FormValues) => {
        const identifier = values.identifier.trim();
        if (!identifier) return;

        await onSubmit(method, identifier);
    };

    return (
        <AppDialog
            open={open}
            onOpenChange={onOpenChange}
            title={`Connect ${method.name}`}
        >
            <div className="rounded-[20px] border border-white/10 bg-white/5 p-4 sm:p-5">
                <div className="flex items-start gap-3 rounded-[18px] border border-white/10 bg-black/20 p-3">
                    <PaymentMethodLogo method={method} className="size-14 rounded-[18px] p-2.5" />
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white">{method.name}</p>
                        <p className="mt-1 text-sm leading-6 text-white/60">
                            {method.description}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(submit)} className="mt-4 space-y-4">
                    <div>
                        <label
                            htmlFor="payment-identifier"
                            className="mb-2 block text-sm font-medium text-white/70"
                        >
                            {method.connectLabel}
                        </label>
                        <input
                            id="payment-identifier"
                            type={method.inputType ?? "text"}
                            placeholder={method.connectPlaceholder}
                            className={cn(
                                "h-12 w-full rounded-[14px] border border-white/10 bg-white/8 px-4 text-sm text-white outline-none transition placeholder:text-white/30",
                                "focus:border-[#00C3FF]/40 focus:bg-white/10",
                                errors.identifier && "border-red-400/70"
                            )}
                            {...register("identifier", {
                                required: `${method.connectLabel} is required`,
                            })}
                        />
                        {errors.identifier?.message ? (
                            <p className="mt-2 text-xs text-red-300">
                                {errors.identifier.message}
                            </p>
                        ) : null}
                    </div>

                    <div className="rounded-[16px] border border-white/10 bg-black/20 px-3 py-2.5 text-xs leading-5 text-white/50">
                        This account will be used when you choose {method.name} for checkout or withdrawals.
                    </div>

                    <StartStreamingButton
                        type="submit"
                        isLoading={isLoading}
                        className="w-full text-base"
                    >
                        {isLoading ? "Connecting..." : `Save ${method.name}`}
                    </StartStreamingButton>
                </form>
            </div>
        </AppDialog>
    );
}

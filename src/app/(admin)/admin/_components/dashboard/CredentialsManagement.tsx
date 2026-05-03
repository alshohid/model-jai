"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CredentialProvider, CredentialValues, useGetCredentialsQuery, useUpdateCredentialMutation } from "@/redux/features/credential/credential";


const providerLabels: Record<CredentialProvider, string> = {
    mail: "Mail",
    stripe: "Stripe",
    paypal: "PayPal",
    moncash: "MonCash",
    bitpay: "BitPay",
    twitch: "Twitch",
    facebook: "Facebook",
    google: "Google",
};

const providerDescriptions: Record<CredentialProvider, string> = {
    mail: "SMTP mail configuration",
    stripe: "Stripe payment gateway credentials",
    paypal: "PayPal payment gateway credentials",
    moncash: "MonCash payment gateway credentials",
    bitpay: "BitPay payment configuration",
    twitch: "Twitch integration credentials",
    facebook: "Facebook OAuth credentials",
    google: "Google OAuth credentials",
};

const sensitiveFields = [
    "password",
    "secret",
    "client_secret",
    "webhook_secret",
    "api_key",
    "token",
];

function formatLabel(key: string) {
    return key
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function isSensitiveField(key: string) {
    return sensitiveFields.some((field) => key.toLowerCase().includes(field));
}

function maskValue(value?: string | null) {
    if (!value) return "Not set";
    return "••••••••••";
}

export default function CredentialsManagement() {
    const { data, isLoading, isFetching } = useGetCredentialsQuery();
    const [updateCredential, { isLoading: isUpdating }] =
        useUpdateCredentialMutation();

    const [selectedProvider, setSelectedProvider] =
        useState<CredentialProvider | null>(null);

    const [formValues, setFormValues] = useState<CredentialValues>({});

    const credentials = useMemo(() => {
        return data ?? {};
    }, [data]);

    const handleOpenModal = (provider: CredentialProvider) => {
        setSelectedProvider(provider);
        setFormValues(credentials[provider] ?? {});
    };

    const handleCloseModal = () => {
        setSelectedProvider(null);
        setFormValues({});
    };

    const handleChange = (key: string, value: string) => {
        setFormValues((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async () => {
        if (!selectedProvider) return;

        try {
            await updateCredential({
                provider: selectedProvider,
                body: formValues,
            }).unwrap();

            handleCloseModal();
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className="h-44 animate-pulse rounded-2xl bg-[#1F2030]"
                    />
                ))}
            </div>
        );
    }

    return (
        <section className="space-y-6 p-4 sm:p-5 md:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">
                        Admin Credentials
                    </h1>
                    <p className="text-sm text-white/60">
                        Manage payment, mail, and social login credentials.
                    </p>
                </div>

                {isFetching && (
                    <span className="text-sm text-purple-300">
                        Refreshing...
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {(Object.keys(credentials) as CredentialProvider[]).map(
                    (provider) => {
                        const values = credentials[provider] ?? {};
                        const fields = Object.entries(values);
                        const configuredCount = fields.filter(
                            ([, value]) => value !== null && value !== ""
                        ).length;

                        return (
                            <div
                                key={provider}
                                className="rounded-2xl border border-white/10 p-5 shadow-sm transition hover:border-pink-500/60"
                            >
                                <div className="mb-5 flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">
                                            {providerLabels[provider] ?? provider}
                                        </h2>
                                        <p className="mt-1 text-sm text-white/50">
                                            {providerDescriptions[provider] ??
                                                "Credential configuration"}
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-[#FF2EC8]/20 px-3 py-1 text-xs font-medium text-[#FF2EC8]">
                                        {configuredCount}/{fields.length} Set
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {fields.slice(0, 4).map(([key, value]) => (
                                        <div
                                            key={key}
                                            className="flex items-center justify-between gap-3 rounded-lg bg-white/[0.04] px-3 py-2"
                                        >
                                            <span className="text-xs text-white/50">
                                                {formatLabel(key)}
                                            </span>

                                            <span className="max-w-[160px] truncate text-xs text-white">
                                                {isSensitiveField(key)
                                                    ? maskValue(value)
                                                    : value || "Not set"}
                                            </span>
                                        </div>
                                    ))}

                                    {fields.length > 4 && (
                                        <p className="text-xs text-white/40">
                                            +{fields.length - 4} more fields
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="button"
                                    onClick={() => handleOpenModal(provider)}
                                    className="mt-5 w-full bg-[#FF2EC8] text-white hover:bg-[#ff2ec875]"
                                >
                                    Update
                                </Button>
                            </div>
                        );
                    }
                )}
            </div>

            {selectedProvider && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#171824] p-6 shadow-xl">
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-white">
                                    Update {providerLabels[selectedProvider]}
                                </h2>
                                <p className="mt-1 text-sm text-white/50">
                                    Change the credential values and save updates.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleCloseModal}
                                className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20"
                            >
                                Close
                            </button>
                        </div>

                        <div className="space-y-4">
                            {Object.entries(formValues).map(([key, value]) => (
                                <div key={key} className="space-y-2">
                                    <label className="text-sm font-medium text-white">
                                        {formatLabel(key)}
                                    </label>

                                    <input
                                        type={
                                            isSensitiveField(key)
                                                ? "password"
                                                : "text"
                                        }
                                        value={value ?? ""}
                                        onChange={(event) =>
                                            handleChange(key, event.target.value)
                                        }
                                        placeholder={`Enter ${formatLabel(key)}`}
                                        className="w-full rounded-lg border border-white/10 bg-[#232434] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-purple-500"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                onClick={handleCloseModal}
                                disabled={isUpdating}
                                className="bg-white/10 text-white hover:bg-white/20"
                            >
                                Cancel
                            </Button>

                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isUpdating}
                                className="bg-[#FF2EC8] text-white hover:bg-[#ff2ec875] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isUpdating ? "Updating..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
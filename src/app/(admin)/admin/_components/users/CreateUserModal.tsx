/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import AppDialog from "@/shared/components/modal/AppDialog";
import { useCreateUserMutation } from "@/redux/features/user/userManagement";
import { toast } from "sonner";
import AppSelect from "../reusable/AppSelect";
import { Field, inputCls } from "../match/matchFormShared";

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const roleOptions = [
    { label: "User", value: "user" },
    { label: "Artist", value: "artist" },
];

export default function CreateUserModal({ isOpen, onClose }: Props) {
    const [createUser, { isLoading }] = useCreateUserMutation();

    const [firstName, setFirstName] = useState("");
    const [middleName, setMiddleName] = useState("");
    const [lastName, setLastName] = useState("");
    const [artistName, setArtistName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [address, setAddress] = useState("");
    const [role, setRole] = useState<"user" | "artist">("user");

    const resetForm = () => {
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setArtistName("");
        setEmail("");
        setPassword("");
        setCity("");
        setState("");
        setZipCode("");
        setAddress("");
        setRole("user");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const normalizeOptionalText = (value: string) => {
        const trimmedValue = value.trim();
        return trimmedValue ? trimmedValue : null;
    };

    const handleCreate = async () => {
        if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
            toast.error("Please fill all required fields");
            return;
        }

        if (!role) {
            toast.error("Please select a role");
            return;
        }

        const fullName = [firstName, middleName, lastName]
            .map((part) => part.trim())
            .filter(Boolean)
            .join(" ");

        try {
            const res = await createUser({
                first_name: firstName.trim(),
                middle_name: normalizeOptionalText(middleName),
                last_name: lastName.trim(),
                artist_name: normalizeOptionalText(artistName),
                name: fullName,
                email: email.trim(),
                password,
                city: normalizeOptionalText(city),
                state: normalizeOptionalText(state),
                zip_code: normalizeOptionalText(zipCode),
                address: normalizeOptionalText(address),
                role,
            }).unwrap();

            toast.success(res?.message || "User created successfully");
            handleClose();
        } catch (err: any) {
            toast.error(err?.data?.message || "User creation failed");
        }
    };

    return (
        <AppDialog
            open={isOpen}
            onOpenChange={(nextOpen) => {
                if (!nextOpen) {
                    handleClose();
                }
            }}
            title="Create User"
            className="max-w-[560px]"
        >
            <div className="space-y-5 py-2">
                <p className="-mt-1 text-sm text-white/60">
                    Add a new user to the platform
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="First Name" required>
                        <input
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="Enter first name"
                            className={inputCls}
                        />
                    </Field>

                    <Field label="Middle Name">
                        <input
                            value={middleName}
                            onChange={(e) => setMiddleName(e.target.value)}
                            placeholder="Enter middle name"
                            className={inputCls}
                        />
                    </Field>
                </div>

                <Field label="Last Name" required>
                    <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter last name"
                        className={inputCls}
                    />
                </Field>

                <Field label="Artist Name">
                    <input
                        value={artistName}
                        onChange={(e) => setArtistName(e.target.value)}
                        placeholder="Enter artist name"
                        className={inputCls}
                    />
                </Field>

                <Field label="Email" required>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Enter email"
                        className={inputCls}
                    />
                </Field>

                <Field label="Password" required>
                    <input
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Enter password"
                        className={inputCls}
                    />
                </Field>

                <Field label="Address">
                    <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter address"
                        className={inputCls}
                    />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="City">
                        <input
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Enter city"
                            className={inputCls}
                        />
                    </Field>

                    <Field label="State">
                        <input
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="Enter state"
                            className={inputCls}
                        />
                    </Field>
                </div>

                <Field label="Zip Code">
                    <input
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        placeholder="Enter zip code"
                        className={inputCls}
                    />
                </Field>

                <Field label="Role" required>
                    <AppSelect
                        value={role}
                        onValueChange={(value) =>
                            setRole(value as "user" | "artist")
                        }
                        options={roleOptions}
                        placeholder="Select one"
                        withPlaceholderOption={false}
                    />
                </Field>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="h-11 flex-1 rounded-lg bg-white/10 text-sm font-medium text-white transition hover:bg-white/15"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleCreate}
                        className={`h-11 flex-1 rounded-lg text-sm font-medium text-white transition ${
                            isLoading
                                ? "cursor-not-allowed bg-white/20"
                                : "cursor-pointer bg-[#FF2EC8] hover:bg-[#ff48d0]"
                        }`}
                    >
                        {isLoading ? "Creating..." : "Create User"}
                    </button>
                </div>
            </div>
        </AppDialog>
    );
}

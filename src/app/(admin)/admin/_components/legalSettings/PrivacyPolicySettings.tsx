"use client";

import {
    useGetAdminPrivacyPolicyQuery,
    useUpdateAdminPrivacyPolicyMutation,
} from "@/redux/features/settings/legalPages/legalPages";
import LegalDocumentSettings from "./LegalDocumentSettings";

export default function PrivacyPolicySettings() {
    const { data, isLoading, isError, refetch } = useGetAdminPrivacyPolicyQuery();
    const [updatePrivacyPolicy, { isLoading: isSaving }] =
        useUpdateAdminPrivacyPolicyMutation();

    return (
        <LegalDocumentSettings
            pageTitle="Privacy Policy"
            pageDescription="Create and update the privacy policy content shown on the public website."
            defaultDocumentTitle="Privacy Policy"
            data={data}
            isLoading={isLoading}
            isError={isError}
            isSaving={isSaving}
            onRetry={refetch}
            onSave={async (payload) => {
                await updatePrivacyPolicy(payload).unwrap();
            }}
        />
    );
}

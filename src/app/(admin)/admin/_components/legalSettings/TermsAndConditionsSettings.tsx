"use client";

import {
    useGetAdminTermsAndConditionsQuery,
    useUpdateAdminTermsAndConditionsMutation,
} from "@/redux/features/settings/legalPages/legalPages";
import LegalDocumentSettings from "./LegalDocumentSettings";

export default function TermsAndConditionsSettings() {
    const { data, isLoading, isError, refetch } =
        useGetAdminTermsAndConditionsQuery();
    const [updateTerms, { isLoading: isSaving }] =
        useUpdateAdminTermsAndConditionsMutation();

    return (
        <LegalDocumentSettings
            pageTitle="Terms and Conditions"
            pageDescription="Create and update the terms and conditions content shown on the public website."
            defaultDocumentTitle="Terms and Conditions"
            data={data}
            isLoading={isLoading}
            isError={isError}
            isSaving={isSaving}
            onRetry={refetch}
            onSave={async (payload) => {
                await updateTerms(payload).unwrap();
            }}
        />
    );
}

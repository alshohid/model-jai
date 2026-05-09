import { Suspense } from "react";
import AuthContainerSkeleton from "../../_components/auth/AuthContainerSkeleton";
import LoginOtpForm from "../../_components/auth/LoginOtpForm";

export default function LoginOtpVerifyPage() {
    return (
        <Suspense fallback={<AuthContainerSkeleton />}>
            <LoginOtpForm />
        </Suspense>
    );
}

import { Suspense } from "react";
import LoginOtpForm from "../../_components/auth/LoginOtpForm";

export default function LoginOtpVerifyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginOtpForm />
        </Suspense>
    );
}

import { Suspense } from "react";
import AuthContainer from "../_components/auth/AuthContainer";
import AuthContainerSkeleton from "../_components/auth/AuthContainerSkeleton";

const Login = () => {
    return (
        <Suspense fallback={<AuthContainerSkeleton />}>
            <AuthContainer />
        </Suspense>
    )
}

export default Login;

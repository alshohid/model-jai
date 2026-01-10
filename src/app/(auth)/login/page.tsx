import { Suspense } from "react";
import AuthContainer from "../_components/auth/AuthContainer";

const Login = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthContainer />
        </Suspense>
    )
}

export default Login;
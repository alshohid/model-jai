
"use client";

import { useAppDispatch } from "@/redux/store";
import Cookies from "js-cookie";
import { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectCurrentToken, setCredentials } from "./authSlice";
import { IAuthUserRole } from "@/types/user/auth";

function useInitiateAuthState() {
    const dispatch = useAppDispatch();
    const token = useSelector(selectCurrentToken);
    const isAppLoading = token === false;

    useEffect(() => {

        const userToken = Cookies.get("token");
        const userRole = Cookies.get("role");
        const userRefresh = Cookies.get("refresh_token");

        const adminToken = Cookies.get("admin_token");
        const adminRole = Cookies.get("admin_role");
        const adminRefresh = Cookies.get("admin_refresh_token");

        const savedToken = userToken ?? adminToken ?? null;
        const savedRole = userRole ?? adminRole ?? null;
        const refreshToken = userRefresh ?? adminRefresh ?? null;

        dispatch(
            setCredentials({
                token: savedToken,
                role: (savedRole as IAuthUserRole) ?? null,
                refreshToken: refreshToken,
            }),
        );
    }, [dispatch]);

    return { isAppLoading };
}

export default function AuthProvider({ children }: PropsWithChildren) {
    const { isAppLoading } = useInitiateAuthState();

    if (isAppLoading) return null;

    return <>{children}</>;
}










// "use client";

// import { useAppDispatch } from "@/redux/store";
// import Cookies from "js-cookie";
// import { PropsWithChildren, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { selectCurrentToken, setCredentials } from "./authSlice";
// import { IAuthUserRole } from "@/types/user/auth";


// function useInitiateAuthState() {
//     const dispatch = useAppDispatch();
//     const token = useSelector(selectCurrentToken);
//     const isAppLoading = token === false;

//     useEffect(() => {
//         const [savedToken, savedRole, refreshToken] = [
//             "token",
//             "role",
//             "refresh_token",
//         ].map((key) => Cookies.get(key));

//         dispatch(
//             setCredentials({
//                 token: savedToken || null,
//                 role: (savedRole as IAuthUserRole) || null,
//                 refreshToken: refreshToken || null,
//             }),
//         );
//     }, [dispatch]);

//     return { isAppLoading };
// }

// export default function AuthProvider({ children }: PropsWithChildren) {
//     const { isAppLoading } = useInitiateAuthState();

//     if (isAppLoading) return null;

//     return <>{children}</>;
// }

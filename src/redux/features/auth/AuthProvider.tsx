
"use client";

import { useAppDispatch } from "@/redux/store";
import Cookies from "js-cookie";
import { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    logOut,
    selectCurrentRole,
    selectCurrentToken,
    setCredentials,
} from "./authSlice";
import { IAuthUserRole } from "@/types/user/auth";
import { RootState } from "@/redux/store";
import {
    getTokenExpiryTime,
    logTokenRefreshDebug,
    requestTokenRefresh,
} from "@/shared/lib/auth/tokenRefresh";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/utils";
import { baseApi } from "@/redux/api/baseApi";

const REFRESH_BUFFER_MS = 60 * 1000;
const REFRESH_RETRY_MS = 30 * 1000;

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

        if (adminToken && adminRole === "super_admin") {
            dispatch(
                setCredentials({
                    token: adminToken,
                    role: adminRole as IAuthUserRole,
                    refreshToken: adminRefresh ?? null,
                })
            );
            return;
        }

        if (userToken && (userRole === "user" || userRole === "artist")) {
            dispatch(
                setCredentials({
                    token: userToken,
                    role: userRole as IAuthUserRole,
                    refreshToken: userRefresh ?? null,
                })
            );
            return;
        }

        dispatch(
            setCredentials({
                token: null,
                role: null,
                refreshToken: null,
            })
        );
    }, [dispatch]);

    // useEffect(() => {

    //     const userToken = Cookies.get("token");
    //     const userRole = Cookies.get("role");
    //     const userRefresh = Cookies.get("refresh_token");

    //     const adminToken = Cookies.get("admin_token");
    //     const adminRole = Cookies.get("admin_role");
    //     const adminRefresh = Cookies.get("admin_refresh_token");

    //     const savedToken = userToken ?? adminToken ?? null;
    //     const savedRole = userRole ?? adminRole ?? null;
    //     const refreshToken = userRefresh ?? adminRefresh ?? null;

    //     dispatch(
    //         setCredentials({
    //             token: savedToken,
    //             role: (savedRole as IAuthUserRole) ?? null,
    //             refreshToken: refreshToken,
    //         }),
    //     );
    // }, [dispatch]);

    return { isAppLoading };
}

function useSilentTokenRefresh() {
    const dispatch = useAppDispatch();
    const token = useSelector(selectCurrentToken);
    const role = useSelector(selectCurrentRole);
    const refreshToken = useSelector((state: RootState) => state.auth.refreshToken);

    useEffect(() => {
        if (typeof token !== "string" || !role) {
            return;
        }

        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        let isCancelled = false;

        const clearRefreshTimer = () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
        };

        const logoutExpiredSession = (error: unknown) => {
            dispatch(logOut());
            dispatch(baseApi.util.resetApiState());
            toast.error("Session expired — please log in again.", {
                description: getErrorMessage(error),
            });
        };

        const scheduleRetry = () => {
            clearRefreshTimer();
            logTokenRefreshDebug("retry-scheduled", {
                source: "proactive",
                retryInMs: REFRESH_RETRY_MS,
            });
            timeoutId = setTimeout(() => {
                void refreshSession("retry");
            }, REFRESH_RETRY_MS);
        };

        const refreshSession = async (
            reason: "scheduled" | "retry" | "focus-visible" = "scheduled"
        ) => {
            try {
                const { accessToken, refreshToken: nextRefreshToken } =
                    await requestTokenRefresh(refreshToken ?? token, {
                        source: "proactive",
                        reason,
                    });

                if (isCancelled) {
                    return;
                }

                dispatch(
                    setCredentials({
                        token: accessToken,
                        refreshToken: nextRefreshToken ?? refreshToken ?? token,
                        role,
                    })
                );
            } catch (error) {
                if (isCancelled) {
                    return;
                }

                const expiryTime = getTokenExpiryTime(token);

                if (expiryTime && Date.now() < expiryTime) {
                    scheduleRetry();
                    return;
                }

                logoutExpiredSession(error);
            }
        };

        const scheduleRefresh = () => {
            const expiryTime = getTokenExpiryTime(token);

            if (!expiryTime) {
                return;
            }

            const refreshDelay = expiryTime - Date.now() - REFRESH_BUFFER_MS;

            if (refreshDelay <= 0) {
                void refreshSession("scheduled");
                return;
            }

            clearRefreshTimer();
            logTokenRefreshDebug("scheduled", {
                source: "proactive",
                refreshInMs: refreshDelay,
                expiresAt: expiryTime,
                bufferMs: REFRESH_BUFFER_MS,
            });
            timeoutId = setTimeout(() => {
                void refreshSession("scheduled");
            }, refreshDelay);
        };

        const handleActivityRefreshCheck = () => {
            if (typeof document !== "undefined" && document.visibilityState === "hidden") {
                return;
            }

            const expiryTime = getTokenExpiryTime(token);

            if (!expiryTime) {
                return;
            }

            if (expiryTime - Date.now() <= REFRESH_BUFFER_MS) {
                void refreshSession("focus-visible");
                return;
            }

            logTokenRefreshDebug("skip", {
                source: "proactive",
                reason: "focus-visible",
                remainingMs: expiryTime - Date.now(),
            });
        };

        scheduleRefresh();

        if (typeof window !== "undefined") {
            window.addEventListener("focus", handleActivityRefreshCheck);
        }

        if (typeof document !== "undefined") {
            document.addEventListener("visibilitychange", handleActivityRefreshCheck);
        }

        return () => {
            isCancelled = true;
            clearRefreshTimer();

            if (typeof window !== "undefined") {
                window.removeEventListener("focus", handleActivityRefreshCheck);
            }

            if (typeof document !== "undefined") {
                document.removeEventListener("visibilitychange", handleActivityRefreshCheck);
            }
        };
    }, [dispatch, refreshToken, role, token]);
}

export default function AuthProvider({ children }: PropsWithChildren) {
    const { isAppLoading } = useInitiateAuthState();
    useSilentTokenRefresh();

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

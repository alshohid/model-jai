"use client";

import { useEffect, useState } from "react";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem("auth");
        setIsAuthenticated(auth === "true");
    }, []);

    const login = () => {
        localStorage.setItem("auth", "true");
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem("auth");
        setIsAuthenticated(false);
    };

    return {
        isAuthenticated,
        login,
        logout,
    };
}

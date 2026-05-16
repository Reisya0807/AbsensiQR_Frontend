import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { LoginUser, Role } from "@/schema/user";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function homeRouteForRole(role: Role | undefined): string {
    return role === Role.SEKRETARIS ? "/admin" : "/home";
}

class Token {
    static getToken(): string | null {
        if (typeof document === "undefined") return null;
        const match = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${TOKEN_KEY}=`));
        return match ? decodeURIComponent(match.split("=")[1]) : null;
    }

    static setToken(token: string) {
        if (typeof document === "undefined") return;
        document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/`;
    }

    static rmToken() {
        if (typeof document !== "undefined") {
            document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
        if (typeof localStorage !== "undefined") {
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem("isLogin");
        }
    }

    static setIsLogin(status: boolean) {
        if (typeof localStorage === "undefined") return;
        localStorage.setItem("isLogin", String(status));
    }

    static getIsLogin(): boolean {
        if (typeof localStorage === "undefined") return false;
        return localStorage.getItem("isLogin") === "true";
    }

    static setUser(user: LoginUser) {
        if (typeof localStorage === "undefined") return;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    static getUser(): LoginUser | null {
        if (typeof localStorage === "undefined") return null;
        const raw = localStorage.getItem(USER_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw) as LoginUser;
        } catch {
            return null;
        }
    }

    static login(token: string, user?: LoginUser, router?: AppRouterInstance) {
        Token.setToken(token);
        Token.setIsLogin(true);
        if (user) Token.setUser(user);
        if (router) {
            router.replace(homeRouteForRole(user?.role));
        }
    }

    static logout(router?: AppRouterInstance) {
        Token.rmToken();
        Token.setIsLogin(false);
        if (router) router.replace("/login");
    }
}

export default Token

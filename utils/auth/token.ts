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
        document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=86400; SameSite=Lax; Secure`;
    }
    static setFirstLogin(isFirst: boolean) {
        console.log("Setting firstLogin cookie to", isFirst);
        if (typeof document === "undefined") return;
        document.cookie = `firstLogin=${isFirst}; path=/`;
    }
    static getFirstLogin(): boolean {
        if (typeof document === "undefined") return false;
        const match = document.cookie
            .split("; ")
            .find((row) => row.startsWith(`firstLogin=`));
        return match ? match.split("=")[1] === "true" : false;
    }

    static rmToken() {
        if (typeof document !== "undefined") {
            document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        }
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

    static login(token: string, user?: LoginUser, isFirstLogin: boolean = false) {
        Token.setToken(token);
        Token.setFirstLogin(isFirstLogin);
        if (user) Token.setUser(user);

    }

    static logout() {
        Token.rmToken();
        Token.setFirstLogin(false);
    }
}

export default Token

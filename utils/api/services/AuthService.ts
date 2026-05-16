import { LoginData } from "@/schema/user";
import { Login } from "@/schema/request";
import APIService from "./APIService";

class AuthService extends APIService<LoginData> {
    async login(payload: Login) {
        return this.fetchAPI(`${this.endpoint}/login`, "POST", false, payload)
    }
}

export default AuthService
